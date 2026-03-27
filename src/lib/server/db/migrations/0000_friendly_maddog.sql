CREATE TABLE `application` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`cycle_id` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`full_name` text DEFAULT '' NOT NULL,
	`discord` text DEFAULT '' NOT NULL,
	`preferred_email` text,
	`reason` text DEFAULT '' NOT NULL,
	`experience` text DEFAULT '' NOT NULL,
	`submitted_at` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`cycle_id`) REFERENCES `application_cycle`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "submitted_at_required_when_not_draft" CHECK("application"."status" = 'draft' OR "application"."submitted_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `application_user_cycle_idx` ON `application` (`user_id`,`cycle_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `application_id_cycle_idx` ON `application` (`id`,`cycle_id`);--> statement-breakpoint
CREATE INDEX `application_cycleId_idx` ON `application` (`cycle_id`);--> statement-breakpoint
CREATE INDEX `application_status_idx` ON `application` (`status`);--> statement-breakpoint
CREATE INDEX `application_cycleId_status_idx` ON `application` (`cycle_id`,`status`);--> statement-breakpoint
CREATE INDEX `application_cycleId_submittedAt_idx` ON `application` (`cycle_id`,`submitted_at`);--> statement-breakpoint
CREATE TABLE `application_cycle` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`opens_at` integer NOT NULL,
	`closes_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "opens_before_closes" CHECK("application_cycle"."opens_at" < "application_cycle"."closes_at")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `application_cycle_name_unique` ON `application_cycle` (`name`);--> statement-breakpoint
CREATE INDEX `application_cycle_opensAt_idx` ON `application_cycle` (`opens_at`);--> statement-breakpoint
CREATE INDEX `application_cycle_closesAt_idx` ON `application_cycle` (`closes_at`);--> statement-breakpoint
CREATE TABLE `application_cycle_subcommittee` (
	`cycle_id` text NOT NULL,
	`subcommittee_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	PRIMARY KEY(`cycle_id`, `subcommittee_id`),
	FOREIGN KEY (`cycle_id`) REFERENCES `application_cycle`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subcommittee_id`) REFERENCES `subcommittee`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `cycle_sub_cycleId_idx` ON `application_cycle_subcommittee` (`cycle_id`);--> statement-breakpoint
CREATE INDEX `cycle_sub_subcomId_idx` ON `application_cycle_subcommittee` (`subcommittee_id`);--> statement-breakpoint
CREATE TABLE `application_subcommittee` (
	`application_id` text NOT NULL,
	`cycle_id` text NOT NULL,
	`subcommittee_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	PRIMARY KEY(`application_id`, `subcommittee_id`),
	FOREIGN KEY (`application_id`) REFERENCES `application`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subcommittee_id`) REFERENCES `subcommittee`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`application_id`,`cycle_id`) REFERENCES `application`(`id`,`cycle_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`cycle_id`,`subcommittee_id`) REFERENCES `application_cycle_subcommittee`(`cycle_id`,`subcommittee_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `app_sub_appId_idx` ON `application_subcommittee` (`application_id`);--> statement-breakpoint
CREATE INDEX `app_sub_cycleId_idx` ON `application_subcommittee` (`cycle_id`);--> statement-breakpoint
CREATE INDEX `app_sub_subcomId_idx` ON `application_subcommittee` (`subcommittee_id`);--> statement-breakpoint
CREATE TABLE `feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`interview_id` text NOT NULL,
	`reviewer_id` text NOT NULL,
	`comments` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`interview_id`) REFERENCES `interview`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reviewer_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `feedback_interviewId_idx` ON `feedback` (`interview_id`);--> statement-breakpoint
CREATE INDEX `feedback_reviewerId_idx` ON `feedback` (`reviewer_id`);--> statement-breakpoint
CREATE TABLE `interview` (
	`id` text PRIMARY KEY NOT NULL,
	`application_id` text NOT NULL,
	`scheduled_at` integer NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`interviewer` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`application_id`) REFERENCES `application`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`interviewer`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `interview_applicationId_idx` ON `interview` (`application_id`);--> statement-breakpoint
CREATE INDEX `interview_scheduledAt_idx` ON `interview` (`scheduled_at`);--> statement-breakpoint
CREATE INDEX `interview_interviewer_idx` ON `interview` (`interviewer`);--> statement-breakpoint
CREATE TABLE `subcommittee` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`colour` integer DEFAULT 1 NOT NULL,
	`description` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subcommittee_name_unique` ON `subcommittee` (`name`);--> statement-breakpoint
CREATE TABLE `vote` (
	`application_id` text NOT NULL,
	`voter_id` text NOT NULL,
	`value` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	PRIMARY KEY(`application_id`, `voter_id`),
	FOREIGN KEY (`application_id`) REFERENCES `application`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`voter_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "binary_vote_value" CHECK("vote"."value" IN (1, 0))
);
--> statement-breakpoint
CREATE INDEX `vote_applicationId_idx` ON `vote` (`application_id`);--> statement-breakpoint
CREATE INDEX `vote_voterId_idx` ON `vote` (`voter_id`);--> statement-breakpoint
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`zid` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_zid_unique` ON `user` (`zid`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);