import { relations, sql } from 'drizzle-orm';
import {
	check,
	date,
	foreignKey,
	index,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
	uniqueIndex,
	uuid
} from 'drizzle-orm/pg-core';
import { APPLICATION_STATUSES } from '../../constants/application-status';
import { user } from './auth.schema';

export * from './auth.schema';

// reused columns
const timestamps = {
	createdAt: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
};

// main swap schema
export const applicationCycle = pgTable(
	'application_cycle',
	{
		id: uuid().primaryKey().defaultRandom(),
		name: text().notNull().unique(), // e.g. "2026 T1"
		opensAt: date({ mode: 'date' }).notNull(),
		closesAt: date({ mode: 'date' }).notNull(),
		...timestamps
	},
	(table) => [
		index('application_cycle_opensAt_idx').on(table.opensAt),
		index('application_cycle_closesAt_idx').on(table.closesAt),
		check('opens_before_closes', sql`${table.opensAt} < ${table.closesAt}`)
	]
);

export const application = pgTable(
	'application',
	{
		id: uuid().primaryKey().defaultRandom(),
		userId: text()
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		cycleId: uuid()
			.notNull()
			.references(() => applicationCycle.id, { onDelete: 'cascade' }),
		status: text({ enum: [...APPLICATION_STATUSES] })
			.default('draft')
			.notNull(),
		fullName: text().notNull().default(''),
		discord: text().notNull().default(''),
		preferredEmail: text(),
		reason: text().notNull().default(''),
		experience: text().notNull().default(''),
		submittedAt: timestamp({ withTimezone: true, mode: 'date' }),
		...timestamps
	},
	(table) => [
		uniqueIndex('application_user_cycle_idx').on(table.userId, table.cycleId),
		unique('application_id_cycle_unique').on(table.id, table.cycleId),
		index('application_cycleId_idx').on(table.cycleId),
		index('application_status_idx').on(table.status),
		index('application_cycleId_status_idx').on(table.cycleId, table.status),
		index('application_cycleId_submittedAt_idx').on(table.cycleId, table.submittedAt),
		check(
			'submitted_at_required_when_not_draft',
			sql`${table.status} = 'draft' OR ${table.submittedAt} IS NOT NULL`
		)
	]
);

export const subcommittee = pgTable('subcommittee', {
	id: text().notNull().primaryKey(), // raw name id e.g. "tech", "events", "marketing"
	name: text().notNull().unique(), // Formatted display name e.g. "Tech", "Events", "Marketing"
	colour: integer().notNull().default(1), // key into badgeVariants see $lib/constants.ts
	description: text().notNull().default('')
});

export const applicationCycle_subcommittee = pgTable(
	'application_cycle_subcommittee',
	{
		cycleId: uuid()
			.notNull()
			.references(() => applicationCycle.id, { onDelete: 'cascade' }),
		subcommitteeId: text()
			.notNull()
			.references(() => subcommittee.id, { onDelete: 'cascade' }),
		...timestamps
	},
	(table) => [
		primaryKey({ columns: [table.cycleId, table.subcommitteeId] }),
		index('cycle_sub_cycleId_idx').on(table.cycleId),
		index('cycle_sub_subcomId_idx').on(table.subcommitteeId)
	]
);

export const application_subcommittee = pgTable(
	'application_subcommittee',
	{
		applicationId: uuid()
			.notNull()
			.references(() => application.id, { onDelete: 'cascade' }),
		cycleId: uuid().notNull(),
		subcommitteeId: text()
			.notNull()
			.references(() => subcommittee.id, { onDelete: 'cascade' }),
		...timestamps
	},
	(table) => [
		primaryKey({ columns: [table.applicationId, table.subcommitteeId] }),
		index('app_sub_appId_idx').on(table.applicationId),
		index('app_sub_cycleId_idx').on(table.cycleId),
		index('app_sub_subcomId_idx').on(table.subcommitteeId),
		foreignKey({
			columns: [table.applicationId, table.cycleId],
			foreignColumns: [application.id, application.cycleId],
			name: 'app_sub_application_cycle_fk'
		}).onDelete('cascade'),
		foreignKey({
			columns: [table.cycleId, table.subcommitteeId],
			foreignColumns: [
				applicationCycle_subcommittee.cycleId,
				applicationCycle_subcommittee.subcommitteeId
			],
			name: 'app_sub_cycle_subcommittee_fk'
		}).onDelete('cascade')
	]
);

export const interview = pgTable(
	'interview',
	{
		id: uuid().primaryKey().defaultRandom(),
		applicationId: uuid()
			.notNull()
			.references(() => application.id, { onDelete: 'cascade' }),
		scheduledAt: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
		location: text().notNull().default(''),
		interviewer: text().references(() => user.id, {
			onDelete: 'set null'
		}),
		...timestamps
	},
	(table) => [
		uniqueIndex('interview_applicationId_idx').on(table.applicationId),
		index('interview_scheduledAt_idx').on(table.scheduledAt),
		index('interview_interviewer_idx').on(table.interviewer)
	]
);

export const feedback = pgTable(
	'feedback',
	{
		id: uuid().primaryKey().defaultRandom(),
		interviewId: uuid()
			.notNull()
			.references(() => interview.id, { onDelete: 'cascade' }),
		reviewerId: text()
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		comments: text().notNull().default(''),
		...timestamps
	},
	(table) => [
		index('feedback_interviewId_idx').on(table.interviewId),
		index('feedback_reviewerId_idx').on(table.reviewerId)
	]
);

export const vote = pgTable(
	'vote',
	{
		applicationId: uuid()
			.notNull()
			.references(() => application.id, { onDelete: 'cascade' }),
		voterId: text()
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		value: integer().notNull(), // 1 for yes, 0 for no
		...timestamps
	},
	(table) => [
		primaryKey({ columns: [table.applicationId, table.voterId] }),
		index('vote_applicationId_idx').on(table.applicationId),
		index('vote_voterId_idx').on(table.voterId),
		check('binary_vote_value', sql`${table.value} IN (1, 0)`)
	]
);

// relations
export const applicationCycleRelations = relations(applicationCycle, ({ many }) => ({
	applications: many(application),
	subcommittees: many(applicationCycle_subcommittee)
}));

export const applicationRelations = relations(application, ({ one, many }) => ({
	user: one(user, { fields: [application.userId], references: [user.id] }),
	cycle: one(applicationCycle, {
		fields: [application.cycleId],
		references: [applicationCycle.id]
	}),
	subcommittees: many(application_subcommittee),
	interview: one(interview),
	votes: many(vote)
}));

export const applicationSubcommitteeRelations = relations(application_subcommittee, ({ one }) => ({
	application: one(application, {
		fields: [application_subcommittee.applicationId],
		references: [application.id]
	}),
	cycle: one(applicationCycle, {
		fields: [application_subcommittee.cycleId],
		references: [applicationCycle.id]
	}),
	subcommittee: one(subcommittee, {
		fields: [application_subcommittee.subcommitteeId],
		references: [subcommittee.id]
	})
}));

export const subcommitteeRelations = relations(subcommittee, ({ many }) => ({
	applications: many(application_subcommittee),
	cycles: many(applicationCycle_subcommittee)
}));

export const applicationCycleSubcommitteeRelations = relations(
	applicationCycle_subcommittee,
	({ one }) => ({
		cycle: one(applicationCycle, {
			fields: [applicationCycle_subcommittee.cycleId],
			references: [applicationCycle.id]
		}),
		subcommittee: one(subcommittee, {
			fields: [applicationCycle_subcommittee.subcommitteeId],
			references: [subcommittee.id]
		})
	})
);

export const interviewRelations = relations(interview, ({ one, many }) => ({
	application: one(application, {
		fields: [interview.applicationId],
		references: [application.id]
	}),
	interviewer: one(user, {
		fields: [interview.interviewer],
		references: [user.id]
	}),
	feedback: many(feedback)
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
	interview: one(interview, {
		fields: [feedback.interviewId],
		references: [interview.id]
	}),
	reviewer: one(user, {
		fields: [feedback.reviewerId],
		references: [user.id]
	})
}));

export const voteRelations = relations(vote, ({ one }) => ({
	application: one(application, {
		fields: [vote.applicationId],
		references: [application.id]
	}),
	voter: one(user, {
		fields: [vote.voterId],
		references: [user.id]
	})
}));

export const extendedUserRelations = relations(user, ({ many }) => ({
	applications: many(application),
	interviews: many(interview),
	feedbacks: many(feedback),
	votes: many(vote)
}));
