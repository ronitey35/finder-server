import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
// Import related tables
import { users } from './user.schema';
import { venues } from './venue.schema';

export const bookings = sqliteTable('bookings', {
  id: text('id')
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`), // UUID as primary key
  userId: text('user_id').notNull(), // Foreign key referencing users table
  venueId: text('venue_id').notNull(), // Foreign key referencing venues table
  bookingDate: text('booking_date').notNull(), // Date stored as text in ISO format
  startTime: text('start_time').notNull(), // Start time stored as text
  endTime: text('end_time').notNull(), // End time stored as text
  status: text('status').notNull().default('pending'),
  // .check(sql`status IN ('pending', 'confirmed', 'cancelled')`), // Status with enum-like constraint
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

// Define relations
export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id]
  }),
  venue: one(venues, {
    fields: [bookings.venueId],
    references: [venues.id]
  })
}));
