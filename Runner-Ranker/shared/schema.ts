import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
import { relations } from "drizzle-orm";

export * from "./models/auth";

export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  path: jsonb("path").$type<{ lat: number; lng: number }[]>().notNull(), // Array of coordinates
  locationName: text("location_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  routeId: integer("route_id").references(() => routes.id),
  type: text("type").notNull().default("interval"), // 'interval', 'run'
  duration: integer("duration").notNull(), // seconds
  distance: integer("distance").notNull(), // meters
  points: integer("points").notNull(), // calculated score
  userColor: text("user_color").notNull().default("#ccff00"), // Personal route color
  completedAt: timestamp("completed_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities)
  .omit({ id: true, userId: true, points: true, completedAt: true })
  .extend({
    duration: z.number().min(1),
    distance: z.number().min(0),
    routeId: z.number().optional(),
    userColor: z.string().startsWith("#").length(7).default("#ccff00"),
  });

export const insertRouteSchema = createInsertSchema(routes)
  .omit({ id: true, createdAt: true })
  .extend({
    path: z.array(z.object({
      lat: z.number(),
      lng: z.number(),
    })).min(2, "A route must contain at least two points"),
  });

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Route = typeof routes.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;

export const usersRelations = relations(users, ({ many }) => ({
  activities: many(activities),
}));

export const routesRelations = relations(routes, ({ many }) => ({
  activities: many(activities),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
  route: one(routes, {
    fields: [activities.routeId],
    references: [routes.id],
  }),
}));
