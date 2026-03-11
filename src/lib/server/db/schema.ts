import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex, index, check, primaryKey, unique } from 'drizzle-orm/sqlite-core';
import { APPLICATION_STATUSES } from '../../constants';
import { user } from './auth.schema';

export * from './auth.schema';

// reused columns
const timestamps = {
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(
		sql`(cast(unixepoch('subsecond') * 1000 as integer))`
	).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date())
		.notNull()
};

// main swap schema
export const applicationCycle = sqliteTable(
	'application_cycle',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text('name').notNull().unique(), // e.g. "2026 T1"
		opensAt: integer('opens_at', { mode: 'timestamp_ms' }).notNull(),
		closesAt: integer('closes_at', { mode: 'timestamp_ms' }).notNull(),
		...timestamps
	},
	(table) => [
		index('application_cycle_opensAt_idx').on(table.opensAt),
		index('application_cycle_closesAt_idx').on(table.closesAt),
        check('opens_before_closes', sql`${table.opensAt} < ${table.closesAt}`),
        
	]
);

export const application = sqliteTable(
	'application',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		cycleId: text('cycle_id')
			.notNull()
			.references(() => applicationCycle.id, { onDelete: 'cascade' }),
		status: text('status', { enum: [...APPLICATION_STATUSES] })
			.default('draft')
			.notNull(),
		fullName: text('full_name').notNull().default(''),
		discord: text('discord').notNull().default(''),
		preferredEmail: text('preferred_email'),
		reason: text('reason').notNull().default(''),
		experience: text('experience').notNull().default(''),
		submittedAt: integer('submitted_at', { mode: 'timestamp_ms' }),
		...timestamps

	},
	(table) => [
		uniqueIndex('application_user_cycle_idx').on(table.userId, table.cycleId),
		index('application_cycleId_idx').on(table.cycleId),
		index('application_status_idx').on(table.status),
		check('submitted_at_required_when_not_draft', sql`${table.status} = 'draft' OR ${table.submittedAt} IS NOT NULL`),

	]
);

export const subcommittee = sqliteTable('subcommittee', {
	id: text('id').notNull().primaryKey(), // raw name id e.g. "tech", "events", "marketing"
	name: text('name').notNull().unique(), // Formatted display name e.g. "Tech", "Events", "Marketing"
	description: text('description').notNull().default('')
});

export const application_subcommittee = sqliteTable('application_subcommittee', {
	applicationId: text('application_id')
		.notNull()
		.references(() => application.id, { onDelete: 'cascade' }),
	subcommitteeId: text('subcommittee_id')
		.notNull()
		.references(() => subcommittee.id, { onDelete: 'cascade' }),
	...timestamps
}, (table) => [
	primaryKey({ columns: [table.applicationId, table.subcommitteeId] }),
	index('app_sub_appId_idx').on(table.applicationId),
	index('app_sub_subcomId_idx').on(table.subcommitteeId)
]);

// relations
export const applicationCycleRelations = relations(applicationCycle, ({ many }) => ({
	applications: many(application)
}));

export const applicationRelations = relations(application, ({ one, many }) => ({
	user: one(user, { fields: [application.userId], references: [user.id] }),
	cycle: one(applicationCycle, {
		fields: [application.cycleId],
		references: [applicationCycle.id]
	}),
	subcommittees: many(application_subcommittee)
}));

export const applicationSubcommitteeRelations = relations(application_subcommittee, ({ one }) => ({
	application: one(application, {
		fields: [application_subcommittee.applicationId],
		references: [application.id]
	}),
	subcommittee: one(subcommittee, {
		fields: [application_subcommittee.subcommitteeId],
		references: [subcommittee.id]
	})
}));

export const subcommitteeRelations = relations(subcommittee, ({ many }) => ({
	applications: many(application_subcommittee)
}));