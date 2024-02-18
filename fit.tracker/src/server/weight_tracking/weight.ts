import { int, timestamp, varchar } from "drizzle-orm/mysql-core";
import { mysqlTable, users } from "../db/schema";
import { relations, sql } from "drizzle-orm";

export const weightHistory = mysqlTable(
    "weight_history", 
    {
        id: varchar("id", {length: 255}).notNull().primaryKey(),
        userId: varchar("userId", { length: 255 }).notNull(),
        weightInGrams: int("weight_in_grams").notNull(),
        createdAt: timestamp("created_at")
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    }
);

export const weightRelations = relations(weightHistory, ({one}) => ({
    use: one(users, { fields: [weightHistory.userId], references: [users.id] })
}));