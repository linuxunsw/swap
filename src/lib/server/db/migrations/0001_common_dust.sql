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
CREATE INDEX `application_cycleId_idx` ON `application` (`cycle_id`);--> statement-breakpoint
CREATE INDEX `application_status_idx` ON `application` (`status`);--> statement-breakpoint
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
CREATE TABLE `application_subcommittee` (
	`application_id` text NOT NULL,
	`subcommittee_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	PRIMARY KEY(`application_id`, `subcommittee_id`),
	FOREIGN KEY (`application_id`) REFERENCES `application`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subcommittee_id`) REFERENCES `subcommittee`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `app_sub_appId_idx` ON `application_subcommittee` (`application_id`);--> statement-breakpoint
CREATE INDEX `app_sub_subcomId_idx` ON `application_subcommittee` (`subcommittee_id`);--> statement-breakpoint
CREATE TABLE `subcommittee` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subcommittee_name_unique` ON `subcommittee` (`name`);