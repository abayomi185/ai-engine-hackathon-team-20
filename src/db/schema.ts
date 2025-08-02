import {
  integer,
  text,
  boolean,
  pgTable,
  timestamp,
} from "drizzle-orm/pg-core";

export const game = pgTable("game", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

export const gameRound = pgTable("game_round", {
  id: integer("id").primaryKey(),
  gameId: integer("game_id").notNull(),
  roundNumber: integer("round_number").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  initialPrompt: text("initial_prompt").notNull(),
});

export const session = pgTable("session", {
  id: integer("id").primaryKey(),
  gameId: integer("game_id"),
  isPlayer: integer("is_player").notNull().default(0),
  avatar: text("avatar").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const submission = pgTable("submission", {
  id: integer("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  gameRound: integer("game_round").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const vote = pgTable("vote", {
  id: integer("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  gameRoundId: integer("game_round_id").notNull(),
  voteValue: integer("vote_value").notNull(),
});
