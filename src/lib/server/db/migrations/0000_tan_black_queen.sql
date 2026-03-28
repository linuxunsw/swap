CREATE TABLE "application" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"cycle_id" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"full_name" text DEFAULT '' NOT NULL,
	"discord" text DEFAULT '' NOT NULL,
	"preferred_email" text,
	"reason" text DEFAULT '' NOT NULL,
	"experience" text DEFAULT '' NOT NULL,
	"submitted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "submitted_at_required_when_not_draft" CHECK ("application"."status" = 'draft' OR "application"."submitted_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "application_cycle" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"opens_at" timestamp with time zone NOT NULL,
	"closes_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "application_cycle_name_unique" UNIQUE("name"),
	CONSTRAINT "opens_before_closes" CHECK ("application_cycle"."opens_at" < "application_cycle"."closes_at")
);
--> statement-breakpoint
CREATE TABLE "application_cycle_subcommittee" (
	"cycle_id" text NOT NULL,
	"subcommittee_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "application_cycle_subcommittee_cycle_id_subcommittee_id_pk" PRIMARY KEY("cycle_id","subcommittee_id")
);
--> statement-breakpoint
CREATE TABLE "application_subcommittee" (
	"application_id" text NOT NULL,
	"cycle_id" text NOT NULL,
	"subcommittee_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "application_subcommittee_application_id_subcommittee_id_pk" PRIMARY KEY("application_id","subcommittee_id")
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" text PRIMARY KEY NOT NULL,
	"interview_id" text NOT NULL,
	"reviewer_id" text NOT NULL,
	"comments" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview" (
	"id" text PRIMARY KEY NOT NULL,
	"application_id" text NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"interviewer" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subcommittee" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"colour" integer DEFAULT 1 NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	CONSTRAINT "subcommittee_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "vote" (
	"application_id" text NOT NULL,
	"voter_id" text NOT NULL,
	"value" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vote_application_id_voter_id_pk" PRIMARY KEY("application_id","voter_id"),
	CONSTRAINT "binary_vote_value" CHECK ("vote"."value" IN (1, 0))
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"zid" text,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_zid_unique" UNIQUE("zid")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_cycle_id_application_cycle_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."application_cycle"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_cycle_subcommittee" ADD CONSTRAINT "application_cycle_subcommittee_cycle_id_application_cycle_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."application_cycle"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_cycle_subcommittee" ADD CONSTRAINT "application_cycle_subcommittee_subcommittee_id_subcommittee_id_fk" FOREIGN KEY ("subcommittee_id") REFERENCES "public"."subcommittee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_subcommittee" ADD CONSTRAINT "application_subcommittee_application_id_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_subcommittee" ADD CONSTRAINT "application_subcommittee_subcommittee_id_subcommittee_id_fk" FOREIGN KEY ("subcommittee_id") REFERENCES "public"."subcommittee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_subcommittee" ADD CONSTRAINT "app_sub_application_cycle_fk" FOREIGN KEY ("application_id","cycle_id") REFERENCES "public"."application"("id","cycle_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_subcommittee" ADD CONSTRAINT "app_sub_cycle_subcommittee_fk" FOREIGN KEY ("cycle_id","subcommittee_id") REFERENCES "public"."application_cycle_subcommittee"("cycle_id","subcommittee_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_interview_id_interview_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interview"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_reviewer_id_user_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview" ADD CONSTRAINT "interview_application_id_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview" ADD CONSTRAINT "interview_interviewer_user_id_fk" FOREIGN KEY ("interviewer") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_application_id_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_voter_id_user_id_fk" FOREIGN KEY ("voter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "application_user_cycle_idx" ON "application" USING btree ("user_id","cycle_id");--> statement-breakpoint
CREATE UNIQUE INDEX "application_id_cycle_idx" ON "application" USING btree ("id","cycle_id");--> statement-breakpoint
CREATE INDEX "application_cycleId_idx" ON "application" USING btree ("cycle_id");--> statement-breakpoint
CREATE INDEX "application_status_idx" ON "application" USING btree ("status");--> statement-breakpoint
CREATE INDEX "application_cycleId_status_idx" ON "application" USING btree ("cycle_id","status");--> statement-breakpoint
CREATE INDEX "application_cycleId_submittedAt_idx" ON "application" USING btree ("cycle_id","submitted_at");--> statement-breakpoint
CREATE INDEX "application_cycle_opensAt_idx" ON "application_cycle" USING btree ("opens_at");--> statement-breakpoint
CREATE INDEX "application_cycle_closesAt_idx" ON "application_cycle" USING btree ("closes_at");--> statement-breakpoint
CREATE INDEX "cycle_sub_cycleId_idx" ON "application_cycle_subcommittee" USING btree ("cycle_id");--> statement-breakpoint
CREATE INDEX "cycle_sub_subcomId_idx" ON "application_cycle_subcommittee" USING btree ("subcommittee_id");--> statement-breakpoint
CREATE INDEX "app_sub_appId_idx" ON "application_subcommittee" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "app_sub_cycleId_idx" ON "application_subcommittee" USING btree ("cycle_id");--> statement-breakpoint
CREATE INDEX "app_sub_subcomId_idx" ON "application_subcommittee" USING btree ("subcommittee_id");--> statement-breakpoint
CREATE INDEX "feedback_interviewId_idx" ON "feedback" USING btree ("interview_id");--> statement-breakpoint
CREATE INDEX "feedback_reviewerId_idx" ON "feedback" USING btree ("reviewer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "interview_applicationId_idx" ON "interview" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "interview_scheduledAt_idx" ON "interview" USING btree ("scheduled_at");--> statement-breakpoint
CREATE INDEX "interview_interviewer_idx" ON "interview" USING btree ("interviewer");--> statement-breakpoint
CREATE INDEX "vote_applicationId_idx" ON "vote" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "vote_voterId_idx" ON "vote" USING btree ("voter_id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");