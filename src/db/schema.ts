import {
  integer,
  text,
  boolean,
  pgTable,
  timestamp,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});

export const game = pgTable("game", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const session = pgTable("session", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull(),
  gameId: integer("game_id").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const vote = pgTable("vote", {
  id: integer("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  voteValue: integer("vote_value").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
