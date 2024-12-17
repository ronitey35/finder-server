import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { v4 as uuidv4 } from 'uuid';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().default(uuidv4()), // UUID as primary key
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  address: text('address'), // Optional address field
  phone: text('phone'), // Optional phone number field
  role: text('role').notNull().default('user'), // Role with enum-like constraints
  token: text('token'), // Optional token field
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});
