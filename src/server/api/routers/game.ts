import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { game, session, gameRound, vote, submission } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { GAME_THEME_PROMPTS } from "~/server/constant/prompts";
import { getRandomWord } from "~/server/constant/words";
import { generateVideo } from "~/server/video-generation/runware";

const MAX_GAME_ROUNDS = 3;

export const gameRouter = createTRPCRouter({
  new: publicProcedure.query(async ({ ctx }) => {
    const newGame = await ctx.db
      .insert(game)
      .values({
        name: `${getRandomWord()} ${getRandomWord()}`,
      })
      .returning();

    const randomIndex = Math.floor(Math.random() * GAME_THEME_PROMPTS.length);
    const randomPrompt = GAME_THEME_PROMPTS[randomIndex]!;

    if (!newGame[0]?.id) {
      throw new Error("Failed to create a new game");
    }

    await ctx.db.insert(gameRound).values({
      gameId: newGame[0].id,
      content: randomPrompt,
    });

    return newGame[0];
  }),

  next: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // 1. Check if game exists and is active
      const gameInstance = await ctx.db.query.game.findFirst({
        where: eq(game.id, input.gameId),
      });
      if (!gameInstance?.isActive) {
        throw new Error("Game not found or not active");
      }

      // 2. Pick a random prompt
      const randomIndex = Math.floor(Math.random() * GAME_THEME_PROMPTS.length);
      const randomPrompt = GAME_THEME_PROMPTS[randomIndex]!;

      // 3. Create a new round
      const newRound = await ctx.db
        .insert(gameRound)
        .values({
          gameId: input.gameId,
          content: randomPrompt,
        })
        .returning();

      // 4. Return new round info
      return newRound[0];
    }),

  join: publicProcedure
    .input(z.object({ name: z.string(), gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const playerSessions = await ctx.db.query.session.findMany({
        where: and(
          eq(session.gameId, input.gameId),
          eq(session.isPlayer, true),
        ),
      });

      const playerRoleIsAvailable = playerSessions.length < 2;

      const newSession = await ctx.db
        .insert(session)
        .values({
          name: input.name,
          gameId: input.gameId,
          isPlayer: playerRoleIsAvailable,
          avatar: "",
        })
        .returning();

      return newSession[0];
    }),

  submit: publicProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const sessionId = ctx.headers.get("sessionId");
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const videoResult = await generateVideo(input.content);

      if (!videoResult.url) {
        throw new Error("Failed to generate video for the submission");
      }

      return await ctx.db.transaction(async (tx) => {
        const sessionExists = await tx.query.session.findFirst({
          where: eq(session.id, sessionId),
        });

        if (!sessionExists?.gameId) {
          throw new Error("Session not found or does not have a gameId");
        }

        const gameInstance = await tx.query.game.findFirst({
          where: eq(game.id, sessionExists.gameId),
        });

        if (!gameInstance?.isActive) {
          throw new Error("Game is not active");
        }

        const latestGameRound = await ctx.db.query.gameRound.findFirst({
          where: eq(gameRound.gameId, gameInstance.id),
          orderBy: (gameRound, { desc }) => [desc(gameRound.createdAt)],
        });

        if (!latestGameRound) {
          throw new Error("No game rounds found for the current game");
        }

        const newSubmission = await tx
          .insert(submission)
          .values({
            sessionId,
            content: input.content,
            gameId: gameInstance.id,
            gameRoundId: latestGameRound.id,
            result: videoResult.url,
          })
          .returning();

        return newSubmission;
      });
    }),

  vote: publicProcedure
    .input(z.object({ submissionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const sessionId = ctx.headers.get("sessionId");
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      await ctx.db.transaction(async (tx) => {
        const sessionExists = await tx.query.session.findFirst({
          where: eq(session.id, sessionId),
        });

        if (!sessionExists?.gameId) {
          throw new Error("Session not found or does not have a gameId");
        }

        const gameInstance = await tx.query.game.findFirst({
          where: eq(game.id, sessionExists.gameId),
        });

        if (!gameInstance?.isActive) {
          throw new Error("Game is not active");
        }

        await tx.insert(vote).values({
          sessionId: sessionId,
          submissionId: input.submissionId,
        });
      });
    }),

  end: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const endGame = await ctx.db
        .update(game)
        .set({ isActive: false })
        .where(eq(game.id, input.gameId))
        .returning();

      if (endGame.length === 0) {
        throw new Error("Game not found");
      }

      return endGame[0];
    }),

  roundResults: publicProcedure.query(async ({ ctx }) => {
    const sessionId = ctx.headers.get("sessionId");
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    const sessionData = await ctx.db.query.session.findFirst({
      where: eq(session.id, sessionId),
    });

    if (!sessionData?.gameId) {
      throw new Error("Session not found");
    }

    const currentGameRound = await ctx.db.query.gameRound.findFirst({
      where: eq(gameRound.gameId, sessionData.gameId),
      orderBy: (gameRound, { desc }) => [desc(gameRound.createdAt)],
    });

    if (!currentGameRound) {
      throw new Error("No game rounds found for the current game");
    }

    const submissions = await ctx.db.query.submission.findMany({
      where: eq(submission.gameRoundId, currentGameRound.id),
    });

    const submissionIds = submissions.map((s) => s.id);
    const votes = await ctx.db.query.vote.findMany({
      where: (vote, { inArray }) => inArray(vote.submissionId, submissionIds),
    });

    const voteCountMap: Record<string, number> = {};
    votes.forEach((v) => {
      voteCountMap[v.submissionId] = (voteCountMap[v.submissionId] ?? 0) + 1;
    });

    return voteCountMap;
  }),

  results: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ ctx, input }) => {
      const rounds = await ctx.db.query.gameRound.findMany({
        where: eq(gameRound.gameId, input.gameId),
        orderBy: (gameRound, { asc }) => [asc(gameRound.createdAt)],
      });

      const results = [];
      for (const round of rounds) {
        const submissions = await ctx.db.query.submission.findMany({
          where: eq(submission.gameRoundId, round.id),
        });

        const submissionIds = submissions.map((s) => s.id);
        const votes = await ctx.db.query.vote.findMany({
          where: (vote, { inArray }) =>
            inArray(vote.submissionId, submissionIds),
        });

        const voteCountMap: Record<string, number> = {};
        votes.forEach((v) => {
          voteCountMap[v.submissionId] =
            (voteCountMap[v.submissionId] ?? 0) + 1;
        });

        results.push({
          roundId: round.id,
          roundContent: round.content,
          submissions: submissions.map((sub) => ({
            ...sub,
            voteCount: voteCountMap[sub.id] ?? 0,
          })),
        });
      }

      return results;
    }),

  status: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ ctx, input }) => {
      const gameInstance = await ctx.db.query.game.findFirst({
        where: eq(game.id, input.gameId),
      });
      if (!gameInstance) {
        throw new Error("Game not found");
      }

      let latestRound = await ctx.db.query.gameRound.findFirst({
        where: eq(gameRound.gameId, input.gameId),
        orderBy: (gameRound, { desc }) => [desc(gameRound.createdAt)],
      });

      const rounds = await ctx.db.query.gameRound.findMany({
        where: eq(gameRound.gameId, input.gameId),
      });

      if (
        latestRound &&
        rounds.length < MAX_GAME_ROUNDS &&
        new Date().getTime() - new Date(latestRound.createdAt).getTime() >
          60_000
      ) {
        const randomIndex = Math.floor(
          Math.random() * GAME_THEME_PROMPTS.length,
        );
        const randomPrompt = GAME_THEME_PROMPTS[randomIndex]!;

        const newRoundArr = await ctx.db
          .insert(gameRound)
          .values({
            gameId: input.gameId,
            content: randomPrompt,
          })
          .returning();

        latestRound = newRoundArr[0];
      }

      return {
        isActive: gameInstance.isActive,
        game: gameInstance,
        gameRound: latestRound,
      };
    }),
});

