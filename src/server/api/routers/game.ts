import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { game, session, gameRound, vote, submission } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

export const gameRouter = createTRPCRouter({
  new: publicProcedure.query(async ({ ctx }) => {
    const newGame = await ctx.db.insert(game).values({
      name: "",
      currentGameRound: 0,
    });

    const { id } = newGame[0]!;
    return { id };
  }),

  join: publicProcedure
    .input(z.object({ name: z.string(), gameId: z.string() }))
    .query(async ({ ctx, input }) => {
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

      return {
        ...newSession[0],
      };
    }),

  submit: publicProcedure
    .input(z.object({ content: z.string() }))
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
        // Check if game is active
        const gameInstance = await tx.query.game.findFirst({
          where: eq(game.id, sessionExists.gameId),
        });

        if (!gameInstance?.isActive) {
          throw new Error("Game is not active");
        }

        // Create a new submission
        const newSubmission = await tx
          .insert(submission)
          .values({
            sessionId,
            content: input.content,
            gameRound: gameInstance.currentGameRound,
          })
          .returning();

        return { ...newSubmission };
      });
    }),

  vote: publicProcedure
    .input(z.object({ voteValue: z.number() }))
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
        // Check if game is active
        const gameInstance = await tx.query.game.findFirst({
          where: eq(game.id, sessionExists.gameId),
        });

        if (!gameInstance?.isActive) {
          throw new Error("Game is not active");
        }

        await tx.insert(vote).values({
          sessionId: sessionId,
          gameRoundId: gameInstance.id,
          voteValue: input.voteValue,
        });

        // Increment the current game round
        await tx
          .update(game)
          .set({ currentGameRound: gameInstance.currentGameRound + 1 })
          .where(eq(game.id, sessionExists.gameId));
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

      return { success: true, game: endGame[0] };
    }),
  results: publicProcedure.query(async ({ ctx }) => {
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

    // Get all submissions for the game
    const submissions = await ctx.db.query.submission.findMany({
      where: eq(submission.sessionId, sessionData.gameId),
    });

    // Get all votes for the game
    const votes = await ctx.db.query.vote.findMany({
      where: eq(vote.gameId, sessionData.gameId),
    });

    // Aggregate votes per submission
    const results = submissions.map((sub) => {
      const subVotes = votes.filter((v) => v.submissionId === sub.id);
      return {
        submission: sub,
        voteCount: subVotes.length,
      };
    });

    // Sort results by voteCount descending
    results.sort((a, b) => b.voteCount - a.voteCount);

    return { results };
  }),
});
