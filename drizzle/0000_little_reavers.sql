CREATE TABLE "test_game" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"currentGameRound" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_game_round" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"roundNumber" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256),
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "test_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"gameId" uuid,
	"isPlayer" boolean DEFAULT false NOT NULL,
	"avatar" text DEFAULT '' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_submission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sessionId" uuid NOT NULL,
	"gameRound" integer NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_vote" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sessionId" uuid NOT NULL,
	"gameRoundId" uuid NOT NULL,
	"voteValue" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "test_game_round" ADD CONSTRAINT "test_game_round_gameId_test_game_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."test_game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_session" ADD CONSTRAINT "test_session_gameId_test_game_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."test_game"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_submission" ADD CONSTRAINT "test_submission_sessionId_test_session_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."test_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_vote" ADD CONSTRAINT "test_vote_sessionId_test_session_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."test_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_vote" ADD CONSTRAINT "test_vote_gameRoundId_test_game_round_id_fk" FOREIGN KEY ("gameRoundId") REFERENCES "public"."test_game_round"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "game_name_idx" ON "test_game" USING btree ("name");--> statement-breakpoint
CREATE INDEX "game_round_game_idx" ON "test_game_round" USING btree ("gameId");--> statement-breakpoint
CREATE INDEX "name_idx" ON "test_post" USING btree ("name");--> statement-breakpoint
CREATE INDEX "session_game_idx" ON "test_session" USING btree ("gameId");--> statement-breakpoint
CREATE INDEX "submission_session_idx" ON "test_submission" USING btree ("sessionId");--> statement-breakpoint
CREATE INDEX "submission_game_round_idx" ON "test_submission" USING btree ("gameRound");--> statement-breakpoint
CREATE INDEX "vote_session_idx" ON "test_vote" USING btree ("sessionId");--> statement-breakpoint
CREATE INDEX "vote_game_round_idx" ON "test_vote" USING btree ("gameRoundId");