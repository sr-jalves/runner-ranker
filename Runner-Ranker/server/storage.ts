import { activities, users, routes, type Activity, type InsertActivity, type Route, type InsertRoute } from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, sql, and } from "drizzle-orm";

export interface IStorage {
  createActivity(activity: InsertActivity & { userId: string, points: number }): Promise<Activity>;
  getUserActivities(userId: string): Promise<Activity[]>;
  getLeaderboard(): Promise<LeaderboardEntry[]>;
  createRoute(route: InsertRoute): Promise<Route>;
  getRoutes(): Promise<Route[]>;
  getRouteLeaderboard(routeId: number): Promise<RouteLeaderboardEntry[]>;
}

export interface LeaderboardEntry {
  userId: string;
  username: string | null;
  displayName: string;
  profileImageUrl: string | null;
  totalPoints: number;
  totalDistance: number;
  rank: number;
}

export interface RouteLeaderboardEntry {
  userId: string;
  userColor: string;
  duration: number;
  completedAt: Date;
  rank: number;
}

export class DatabaseStorage implements IStorage {
  async createActivity(activity: InsertActivity & { userId: string, points: number }): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async getUserActivities(userId: string): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.completedAt));
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const results = await db
      .select({
        userId: activities.userId,
        username: users.email,
        displayName: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email}, 'Anonymous')`,
        profileImageUrl: users.profileImageUrl,
        totalPoints: sql<number>`sum(${activities.points})`.mapWith(Number),
        totalDistance: sql<number>`sum(${activities.distance})`.mapWith(Number),
      })
      .from(activities)
      .leftJoin(users, eq(activities.userId, users.id))
      .groupBy(
        activities.userId,
        users.id,
        users.email,
        users.firstName,
        users.lastName,
        users.profileImageUrl
      )
      .orderBy(desc(sql`sum(${activities.points})`))
      .limit(50);

    return results.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }

  async createRoute(route: InsertRoute): Promise<Route> {
    const [newRoute] = await db.insert(routes).values(route).returning();
    return newRoute;
  }

  async getRoutes(): Promise<Route[]> {
    return await db.select().from(routes);
  }

  async getRouteLeaderboard(routeId: number): Promise<RouteLeaderboardEntry[]> {
    // Get shortest time for each user on this specific route
    const subquery = db
      .select({
        userId: activities.userId,
        minDuration: sql<number>`min(${activities.duration})`.as('min_duration'),
      })
      .from(activities)
      .where(eq(activities.routeId, routeId))
      .groupBy(activities.userId)
      .as('user_best');

    const results = await db
      .select({
        userId: activities.userId,
        userColor: activities.userColor,
        duration: activities.duration,
        completedAt: activities.completedAt,
      })
      .from(activities)
      .innerJoin(
        subquery,
        and(
          eq(activities.userId, subquery.userId),
          eq(activities.duration, subquery.minDuration)
        )
      )
      .where(eq(activities.routeId, routeId))
      .orderBy(asc(activities.duration))
      .limit(50);

    return results.map((entry, index) => ({
      ...entry,
      completedAt: entry.completedAt!,
      rank: index + 1,
    }));
  }
}

export const storage = new DatabaseStorage();
