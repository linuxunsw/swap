CREATE TABLE "application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"cycleId" uuid NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"fullName" text DEFAULT '' NOT NULL,
	"discord" text DEFAULT '' NOT NULL,
	"preferredEmail" text,
	"reason" text DEFAULT '' NOT NULL,
	"experience" text DEFAULT '' NOT NULL,
	"submittedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "submitted_at_required_when_not_draft" CHECK ("application"."status" = 'draft' OR "application"."submittedAt" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "application_cycle" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"opensAt" date NOT NULL,
	"closesAt" date NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "application_cycle_name_unique" UNIQUE("name"),
	CONSTRAINT "opens_before_closes" CHECK ("application_cycle"."opensAt" < "application_cycle"."closesAt")
);
--> statement-breakpoint
CREATE TABLE "application_cycle_subcommittee" (
	"cycleId" uuid NOT NULL,
	"subcommitteeId" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "application_cycle_subcommittee_cycleId_subcommitteeId_pk" PRIMARY KEY("cycleId","subcommitteeId")
);
--> statement-breakpoint
CREATE TABLE "application_subcommittee" (
	"applicationId" uuid NOT NULL,
	"cycleId" uuid NOT NULL,
	"subcommitteeId" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "application_subcommittee_applicationId_subcommitteeId_pk" PRIMARY KEY("applicationId","subcommitteeId")
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interviewId" uuid NOT NULL,
	"reviewerId" text NOT NULL,
	"comments" text DEFAULT '' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicationId" uuid NOT NULL,
	"scheduledAt" timestamp with time zone NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"interviewer" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
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
	"applicationId" uuid NOT NULL,
	"voterId" text NOT NULL,
	"value" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vote_applicationId_voterId_pk" PRIMARY KEY("applicationId","voterId"),
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
ALTER TABLE "application" ADD CONSTRAINT "application_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_cycleId_application_cycle_id_fk" FOREIGN KEY ("cycleId") REFERENCES "public"."application_cycle"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_cycle_subcommittee" ADD CONSTRAINT "application_cycle_subcommittee_cycleId_application_cycle_id_fk" FOREIGN KEY ("cycleId") REFERENCES "public"."application_cycle"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_cycle_subcommittee" ADD CONSTRAINT "application_cycle_subcommittee_subcommitteeId_subcommittee_id_fk" FOREIGN KEY ("subcommitteeId") REFERENCES "public"."subcommittee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_subcommittee" ADD CONSTRAINT "application_subcommittee_applicationId_application_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_subcommittee" ADD CONSTRAINT "application_subcommittee_subcommitteeId_subcommittee_id_fk" FOREIGN KEY ("subcommitteeId") REFERENCES "public"."subcommittee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_subcommittee" ADD CONSTRAINT "app_sub_application_cycle_fk" FOREIGN KEY ("applicationId","cycleId") REFERENCES "public"."application"("id","cycleId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_subcommittee" ADD CONSTRAINT "app_sub_cycle_subcommittee_fk" FOREIGN KEY ("cycleId","subcommitteeId") REFERENCES "public"."application_cycle_subcommittee"("cycleId","subcommitteeId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_interviewId_interview_id_fk" FOREIGN KEY ("interviewId") REFERENCES "public"."interview"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_reviewerId_user_id_fk" FOREIGN KEY ("reviewerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview" ADD CONSTRAINT "interview_applicationId_application_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview" ADD CONSTRAINT "interview_interviewer_user_id_fk" FOREIGN KEY ("interviewer") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_applicationId_application_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_voterId_user_id_fk" FOREIGN KEY ("voterId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "application_user_cycle_idx" ON "application" USING btree ("userId","cycleId");--> statement-breakpoint
CREATE UNIQUE INDEX "application_id_cycle_idx" ON "application" USING btree ("id","cycleId");--> statement-breakpoint
CREATE INDEX "application_cycleId_idx" ON "application" USING btree ("cycleId");--> statement-breakpoint
CREATE INDEX "application_status_idx" ON "application" USING btree ("status");--> statement-breakpoint
CREATE INDEX "application_cycleId_status_idx" ON "application" USING btree ("cycleId","status");--> statement-breakpoint
CREATE INDEX "application_cycleId_submittedAt_idx" ON "application" USING btree ("cycleId","submittedAt");--> statement-breakpoint
CREATE INDEX "application_cycle_opensAt_idx" ON "application_cycle" USING btree ("opensAt");--> statement-breakpoint
CREATE INDEX "application_cycle_closesAt_idx" ON "application_cycle" USING btree ("closesAt");--> statement-breakpoint
CREATE INDEX "cycle_sub_cycleId_idx" ON "application_cycle_subcommittee" USING btree ("cycleId");--> statement-breakpoint
CREATE INDEX "cycle_sub_subcomId_idx" ON "application_cycle_subcommittee" USING btree ("subcommitteeId");--> statement-breakpoint
CREATE INDEX "app_sub_appId_idx" ON "application_subcommittee" USING btree ("applicationId");--> statement-breakpoint
CREATE INDEX "app_sub_cycleId_idx" ON "application_subcommittee" USING btree ("cycleId");--> statement-breakpoint
CREATE INDEX "app_sub_subcomId_idx" ON "application_subcommittee" USING btree ("subcommitteeId");--> statement-breakpoint
CREATE INDEX "feedback_interviewId_idx" ON "feedback" USING btree ("interviewId");--> statement-breakpoint
CREATE INDEX "feedback_reviewerId_idx" ON "feedback" USING btree ("reviewerId");--> statement-breakpoint
CREATE UNIQUE INDEX "interview_applicationId_idx" ON "interview" USING btree ("applicationId");--> statement-breakpoint
CREATE INDEX "interview_scheduledAt_idx" ON "interview" USING btree ("scheduledAt");--> statement-breakpoint
CREATE INDEX "interview_interviewer_idx" ON "interview" USING btree ("interviewer");--> statement-breakpoint
CREATE INDEX "vote_applicationId_idx" ON "vote" USING btree ("applicationId");--> statement-breakpoint
CREATE INDEX "vote_voterId_idx" ON "vote" USING btree ("voterId");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");