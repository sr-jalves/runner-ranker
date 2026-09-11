import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { InsertActivity } from "@shared/schema";

// GET /api/activities
export function useActivities() {
  return useQuery({
    queryKey: [api.activities.list.path],
    queryFn: async () => {
      const res = await fetch(api.activities.list.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch activities");
      }
      return api.activities.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/activities
export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertActivity) => {
      const res = await fetch(api.activities.create.path, {
        method: api.activities.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create activity");
      }
      
      return api.activities.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.activities.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.leaderboard.get.path] });
    },
  });
}
