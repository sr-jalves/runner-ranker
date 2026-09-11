import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { users, activities, routes } from "@shared/schema";
import { sql } from "drizzle-orm";

async function seedDatabase() {
  try {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    if (Number(userCount.count) === 0) {
      console.log("Seeding database...");
      
      const fakeUsers = [
        { id: 'user_1', email: 'alex@runner.com', firstName: 'Alex', lastName: 'Bolt', profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
        { id: 'user_2', email: 'sam@sprinter.com', firstName: 'Sam', lastName: 'Swift', profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' },
        { id: 'user_3', email: 'jordan@pacer.com', firstName: 'Jordan', lastName: 'Pace', profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
      ];
      
      await db.insert(users).values(fakeUsers);

      const [route1] = await db.insert(routes).values({
        name: "Central Park Loop",
        locationName: "New York, NY",
        path: [
          { lat: 40.785091, lng: -73.968285 },
          { lat: 40.771209, lng: -73.967399 },
          { lat: 40.773271, lng: -73.981807 },
        ],
      }).returning();

      const fakeActivities = [
        { userId: 'user_1', routeId: route1.id, type: 'interval', duration: 1800, distance: 5000, points: 800, userColor: "#ff00ff" },
        { userId: 'user_2', routeId: route1.id, type: 'interval', duration: 1750, distance: 5000, points: 850, userColor: "#00ffff" },
        { userId: 'user_3', routeId: route1.id, type: 'run', duration: 1900, distance: 5000, points: 750, userColor: "#ccff00" },
      ];

      await db.insert(activities).values(fakeActivities);
      console.log("Database seeded!");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);
  seedDatabase();

  app.post(api.activities.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.activities.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      const points = Math.floor((input.duration / 6) + (input.distance / 10));
      const activity = await storage.createActivity({ ...input, userId, points });
      res.status(201).json(activity);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.get(api.activities.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    res.json(await storage.getUserActivities((req.user as any).claims.sub));
  });

  app.get(api.routes.list.path, async (req, res) => {
    res.json(await storage.getRoutes());
  });

  app.post(api.routes.create.path, async (req, res) => {
    try {
      const input = api.routes.create.input.parse(req.body);
      res.status(201).json(await storage.createRoute(input));
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.get(api.routes.leaderboard.path, async (req, res) => {
    res.json(await storage.getRouteLeaderboard(Number(req.params.id)));
  });

  app.get(api.leaderboard.get.path, async (req, res) => {
    res.json(await storage.getLeaderboard());
  });

  return httpServer;
}
