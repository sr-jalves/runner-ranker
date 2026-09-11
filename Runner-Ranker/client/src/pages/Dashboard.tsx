import { useAuth } from "@/hooks/use-auth";
import { useActivities } from "@/hooks/use-activities";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { Layout } from "@/components/Layout";
import { NeonCard } from "@/components/NeonCard";
import { Flame, Route as RouteIcon, Trophy, History } from "lucide-react";
import { format } from "date-fns";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: activities, isLoading: activitiesLoading } = useActivities();
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard();

  const userRank = leaderboard?.find(u => u.userId === user?.id)?.rank || "-";
  
  // Calculate stats
  const totalPoints = activities?.reduce((acc, curr) => acc + curr.points, 0) || 0;
  const totalDistance = activities?.reduce((acc, curr) => acc + curr.distance, 0) || 0;
  const totalDuration = activities?.reduce((acc, curr) => acc + curr.duration, 0) || 0;

  // Chart Data: Last 7 activities
  const chartData = activities?.slice(0, 7).reverse().map(a => ({
    date: format(new Date(a.completedAt!), "MMM d"),
    points: a.points
  })) || [];

  if (activitiesLoading || leaderboardLoading) {
    return (
      <Layout>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full rounded-2xl bg-zinc-900" />)}
        </div>
        <Skeleton className="h-80 w-full rounded-2xl bg-zinc-900" />
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-zinc-500 font-bold uppercase tracking-widest text-sm mb-1">Welcome Back</h2>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase text-white">
            Ready to <span className="text-primary neon-text">crush it?</span>
          </h1>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <NeonCard variant="primary" glow className="relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-primary/10 w-32 h-32 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-zinc-950 rounded-xl border border-primary/20">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <span className="text-primary font-mono text-xs font-bold uppercase tracking-wider py-1 px-2 rounded bg-primary/10 border border-primary/20">Total Score</span>
          </div>
          <p className="text-5xl font-mono font-bold text-white mb-1 tracking-tighter">
            {totalPoints.toLocaleString()}
          </p>
          <p className="text-zinc-500 font-medium text-sm">Points Earned</p>
        </NeonCard>

        <NeonCard variant="secondary" glow className="relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-secondary/10 w-32 h-32 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-zinc-950 rounded-xl border border-secondary/20">
              <RouteIcon className="w-6 h-6 text-secondary" />
            </div>
            <span className="text-secondary font-mono text-xs font-bold uppercase tracking-wider py-1 px-2 rounded bg-secondary/10 border border-secondary/20">Distance</span>
          </div>
          <p className="text-5xl font-mono font-bold text-white mb-1 tracking-tighter">
            {(totalDistance / 1000).toFixed(1)}<span className="text-2xl text-zinc-600">km</span>
          </p>
          <p className="text-zinc-500 font-medium text-sm">Total Distance</p>
        </NeonCard>

        <NeonCard variant="accent" glow className="relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-accent/10 w-32 h-32 rounded-full blur-3xl group-hover:bg-accent/20 transition-all" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-zinc-950 rounded-xl border border-accent/20">
              <Trophy className="w-6 h-6 text-accent" />
            </div>
            <span className="text-accent font-mono text-xs font-bold uppercase tracking-wider py-1 px-2 rounded bg-accent/10 border border-accent/20">Global Rank</span>
          </div>
          <p className="text-5xl font-mono font-bold text-white mb-1 tracking-tighter">
            #{userRank}
          </p>
          <p className="text-zinc-500 font-medium text-sm">Current Standing</p>
        </NeonCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 h-[400px]">
          <h3 className="text-xl font-bold italic uppercase mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full" />
            Performance Trend
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ccff00" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ccff00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="#52525b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                fontFamily="JetBrains Mono"
              />
              <YAxis 
                stroke="#52525b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                fontFamily="JetBrains Mono"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#ccff00', fontFamily: 'JetBrains Mono' }}
              />
              <Area 
                type="monotone" 
                dataKey="points" 
                stroke="#ccff00" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorPoints)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 h-[400px] overflow-hidden flex flex-col">
          <h3 className="text-xl font-bold italic uppercase mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-secondary rounded-full" />
            Recent Runs
          </h3>
          
          <div className="overflow-y-auto pr-2 flex-1 space-y-3 custom-scrollbar">
            {!activities || activities.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-50">
                <History className="w-12 h-12 mb-2" />
                <p className="font-mono text-sm">No activities yet</p>
              </div>
            ) : (
              activities.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-white/5 group-hover:border-primary/50 transition-colors">
                      <Flame className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm uppercase">{activity.type}</p>
                      <p className="text-xs text-zinc-500 font-mono">
                        {format(new Date(activity.completedAt!), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-primary text-lg">+{activity.points}</p>
                    <p className="text-xs text-zinc-500 font-mono">{(activity.distance / 1000).toFixed(2)}km</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
