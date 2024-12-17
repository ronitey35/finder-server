import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { v4 as uuidv4 } from 'uuid';

export const venues = sqliteTable('venues', {
  id: text('id').primaryKey().default(uuidv4()), // UUID as primary key
  name: text('name').notNull(),
  location: text('location').notNull(),
  availability: integer('availability').default(1).notNull(), // SQLite does not have a native boolean type
  price: integer('price').notNull(),
  capacity: integer('capacity').notNull(),
  amenities: text('amenities').notNull(), // Store JSON as TEXT
  vendorId: text('vendor_id'), // UUID foreign key to vendors table
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

// Define relations if the 'users' (or vendors) table exists
export const venuesRelations = relations(venues, ({ one }) => ({
  vendor: one(users, {
    fields: [venues.vendorId],
    references: [users.id]
  })
}));

// If you have a 'users' table:
export const users = sqliteTable('users', {
  id: text('id').primaryKey().default(uuidv4()),
  name: text('name').notNull(),
  email: text('email').notNull().unique()
});
