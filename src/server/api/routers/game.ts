import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { game, session, gameRound, vote, submission } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

export const gameRouter = createTRPCRouter({
  new: publicProcedure.query(async ({ ctx, input }) => {}),

  join: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = uuidv4();

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
          gameId: input.gameId,
          isPlayer: playerRoleIsAvailable,
          avatar: `https://avatars.dicebear.com/api/initials/${userId}.svg`,
        })
        .returning();

      return {
        ...newSession[0],
      };
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

        if (!sessionExists) {
          throw new Error("Session not found");
        }

        // Check if game is active
        // const gameExists = await tx.query.game.findFirst({
        //   where: eq(game.id, sessionExists.gameId),
        // });
      });
    }),
  // getResults: publicProcedure.query(async ({ ctx }) => {}),
});
