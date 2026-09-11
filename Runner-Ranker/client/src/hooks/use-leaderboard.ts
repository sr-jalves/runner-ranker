import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useLeaderboard() {
  return useQuery({
    queryKey: [api.leaderboard.get.path],
    queryFn: async () => {
      const res = await fetch(api.leaderboard.get.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch leaderboard");
      }
      return api.leaderboard.get.responses[200].parse(await res.json());
    },
  });
}
