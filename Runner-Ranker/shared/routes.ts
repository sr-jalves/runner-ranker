import { z } from 'zod';
import { insertActivitySchema, activities, users, routes, insertRouteSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  activities: {
    create: {
      method: 'POST' as const,
      path: '/api/activities' as const,
      input: insertActivitySchema,
      responses: {
        201: z.custom<typeof activities.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/activities' as const,
      responses: {
        200: z.array(z.custom<typeof activities.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
  },
  routes: {
    list: {
      method: 'GET' as const,
      path: '/api/routes' as const,
      responses: {
        200: z.array(z.custom<typeof routes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/routes' as const,
      input: insertRouteSchema,
      responses: {
        201: z.custom<typeof routes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    leaderboard: {
      method: 'GET' as const,
      path: '/api/routes/:id/leaderboard' as const,
      responses: {
        200: z.array(
          z.object({
            userId: z.string(),
            userColor: z.string(),
            duration: z.number(),
            completedAt: z.date(),
            rank: z.number(),
          })
        ),
      },
    },
  },
  leaderboard: {
    get: {
      method: 'GET' as const,
      path: '/api/leaderboard' as const,
      responses: {
        200: z.array(
          z.object({
            userId: z.string(),
            username: z.string().nullable(),
            displayName: z.string(),
            profileImageUrl: z.string().nullable(),
            totalPoints: z.number(),
            totalDistance: z.number(),
            rank: z.number(),
          })
        ),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
