import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { v4 as uuidv4 } from 'uuid';

export const testimonials = sqliteTable('testimonials', {
  id: text('id').primaryKey().default(uuidv4()), // UUID generation using SQLite
  name: text('name').notNull(),
  message: text('message').notNull(),
  rating: integer('rating').notNull(), // Enforce min and max constraints
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});
