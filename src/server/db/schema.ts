// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `test_${name}`);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const game = createTable(
  "game",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    name: d.text().notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    isActive: d.boolean().notNull().default(true),
  }),
  (t) => [index("game_name_idx").on(t.name)],
);

export const gameRound = createTable(
  "game_round",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    gameId: d
      .uuid()
      .notNull()
      .references(() => game.id, { onDelete: "cascade" }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    content: d.text().notNull(),
  }),
  (t) => [index("game_round_game_idx").on(t.gameId)],
);

export const session = createTable(
  "session",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    name: d.text().notNull(),
    gameId: d
      .uuid()
      .notNull()
      .references(() => game.id, { onDelete: "set null" }),
    isPlayer: d.boolean().notNull().default(false),
    avatar: d.text().notNull().default(""),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [index("session_game_idx").on(t.gameId)],
);

export const submission = createTable(
  "submission",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    sessionId: d
      .uuid()
      .notNull()
      .references(() => session.id, { onDelete: "cascade" }),
    gameId: d
      .uuid()
      .notNull()
      .references(() => game.id, { onDelete: "cascade" }),
    gameRoundId: d
      .uuid()
      .notNull()
      .references(() => gameRound.id, { onDelete: "cascade" }),
    content: d.text().notNull(),
    result: d.text(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("submission_session_idx").on(t.sessionId),
    index("submission_game_round_idx").on(t.gameRoundId),
  ],
);

export const vote = createTable(
  "vote",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    sessionId: d
      .uuid()
      .notNull()
      .references(() => session.id, { onDelete: "cascade" }),
    submissionId: d
      .uuid()
      .notNull()
      .references(() => submission.id, { onDelete: "cascade" }),
  }),
  (t) => [
    index("vote_session_idx").on(t.sessionId),
    index("vote_submission_idx").on(t.submissionId),
  ],
);
