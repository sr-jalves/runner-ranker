import { Layout } from "@/components/Layout";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Trophy, Medal, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useLeaderboard();
  const { user: currentUser } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-4 mt-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl bg-zinc-900" />
          ))}
        </div>
      </Layout>
    );
  }

  const topThree = leaderboard?.slice(0, 3) || [];
  const rest = leaderboard?.slice(3) || [];

  return (
    <Layout>
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-2">
          Global <span className="text-accent neon-text-pink">Rankings</span>
        </h1>
        <p className="text-zinc-500 font-medium">Competition ends Sunday 11:59PM</p>
      </header>

      {/* Podium */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-16 px-4 min-h-[300px]">
        {/* 2nd Place */}
        {topThree[1] && (
          <div className="w-full md:w-1/3 order-2 md:order-1 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full border-4 border-zinc-700 overflow-hidden bg-zinc-800">
                {topThree[1].profileImageUrl ? (
                   <img src={topThree[1].profileImageUrl} className="w-full h-full object-cover" />
                ) : <User className="w-full h-full p-4 text-zinc-600" />}
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-zinc-700 text-white text-xs font-bold px-2 py-0.5 rounded-full border border-zinc-600">
                #2
              </div>
            </div>
            <div className="w-full bg-zinc-900/50 rounded-t-2xl p-6 border-t border-x border-zinc-800 flex flex-col items-center h-48 justify-end relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-zinc-800/20 to-transparent" />
               <p className="font-bold text-white mb-1 relative z-10">{topThree[1].displayName}</p>
               <p className="font-mono text-zinc-400 text-sm relative z-10">{topThree[1].totalPoints} pts</p>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <div className="w-full md:w-1/3 order-1 md:order-2 flex flex-col items-center z-10">
             <div className="relative mb-4">
               <Trophy className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-500 fill-yellow-500 animate-bounce" />
              <div className="w-24 h-24 rounded-full border-4 border-yellow-500 overflow-hidden bg-zinc-800 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                {topThree[0].profileImageUrl ? (
                   <img src={topThree[0].profileImageUrl} className="w-full h-full object-cover" />
                ) : <User className="w-full h-full p-4 text-zinc-600" />}
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-sm font-black px-3 py-0.5 rounded-full border border-yellow-400">
                #1
              </div>
            </div>
            <div className="w-full bg-gradient-to-b from-yellow-500/10 to-zinc-900/50 rounded-t-2xl p-6 border-t border-x border-yellow-500/30 flex flex-col items-center h-60 justify-end relative shadow-[0_-10px_30px_-10px_rgba(234,179,8,0.1)]">
               <p className="font-bold text-white text-lg mb-1">{topThree[0].displayName}</p>
               <p className="font-mono text-yellow-500 font-bold text-lg">{topThree[0].totalPoints} pts</p>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <div className="w-full md:w-1/3 order-3 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full border-4 border-orange-700 overflow-hidden bg-zinc-800">
                {topThree[2].profileImageUrl ? (
                   <img src={topThree[2].profileImageUrl} className="w-full h-full object-cover" />
                ) : <User className="w-full h-full p-4 text-zinc-600" />}
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-700 text-white text-xs font-bold px-2 py-0.5 rounded-full border border-orange-600">
                #3
              </div>
            </div>
            <div className="w-full bg-zinc-900/50 rounded-t-2xl p-6 border-t border-x border-zinc-800 flex flex-col items-center h-40 justify-end relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-zinc-800/20 to-transparent" />
               <p className="font-bold text-white mb-1 relative z-10">{topThree[2].displayName}</p>
               <p className="font-mono text-zinc-400 text-sm relative z-10">{topThree[2].totalPoints} pts</p>
            </div>
          </div>
        )}
      </div>

      {/* Rest of the list */}
      <div className="space-y-3 pb-12">
        {rest.map((runner) => {
          const isMe = runner.userId === currentUser?.id;
          return (
            <div 
              key={runner.userId}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01]",
                isMe 
                  ? "bg-primary/5 border-primary/30 shadow-[0_0_15px_rgba(204,255,0,0.1)]" 
                  : "bg-zinc-900/30 border-white/5 hover:bg-zinc-800/50"
              )}
            >
              <div className="font-mono font-bold text-zinc-500 w-8 text-center">#{runner.rank}</div>
              
              <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-white/10">
                {runner.profileImageUrl ? (
                  <img src={runner.profileImageUrl} alt={runner.displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-full h-full p-2 text-zinc-500" />
                )}
              </div>

              <div className="flex-1">
                <p className={cn("font-bold text-sm", isMe ? "text-primary" : "text-white")}>
                  {runner.displayName} {isMe && "(You)"}
                </p>
                <p className="text-xs text-zinc-500">Level 1 Runner</p>
              </div>

              <div className="text-right">
                <p className="font-mono font-bold text-white">{runner.totalPoints.toLocaleString()}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Points</p>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
