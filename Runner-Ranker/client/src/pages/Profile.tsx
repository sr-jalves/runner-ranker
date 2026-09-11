import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useActivities } from "@/hooks/use-activities";
import { format } from "date-fns";
import { Medal, Calendar, MapPin, Clock } from "lucide-react";
import { NeonCard } from "@/components/NeonCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: activities, isLoading } = useActivities();

  if (!user) return null;

  const totalSessions = activities?.length || 0;
  const totalHours = activities?.reduce((acc, curr) => acc + curr.duration, 0) || 0;
  
  return (
    <Layout>
      <div className="relative mb-12">
        <div className="h-32 w-full bg-gradient-to-r from-zinc-900 to-zinc-950 rounded-2xl border border-white/10 mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://pixabay.com/get/g5fb978915f5f1668cb823317de5bdb6e229d98b883f7b805904ec861a04e9a2bb021f812d80aaf1875c2b1a2ef0fceaf5b754c428e3bb08504ffe72acc9bbab4_1280.jpg')] opacity-10 bg-cover bg-center" />
        </div>
        
        <div className="absolute -bottom-6 left-6 flex items-end gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-black bg-zinc-800 shadow-xl overflow-hidden">
            {user.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-zinc-800" />
            )}
          </div>
          <div className="mb-2">
            <h1 className="text-3xl font-black italic uppercase text-white">{user.firstName} {user.lastName}</h1>
            <p className="text-primary font-mono text-sm">@{user.email?.split("@")[0] || 'athlete'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Sessions", value: totalSessions, icon: Calendar },
          { label: "Hours", value: (totalHours / 3600).toFixed(1), icon: Clock },
          { label: "Badges", value: "3", icon: Medal },
          { label: "Streak", value: "5 Days", icon: MapPin },
        ].map((stat, i) => (
          <NeonCard key={i} className="flex flex-col items-center justify-center p-4 text-center">
            <stat.icon className="w-5 h-5 text-zinc-500 mb-2" />
            <span className="text-2xl font-mono font-bold text-white">{stat.value}</span>
            <span className="text-xs text-zinc-600 uppercase font-bold tracking-wider">{stat.label}</span>
          </NeonCard>
        ))}
      </div>

      <h2 className="text-xl font-bold italic uppercase mb-6 text-white flex items-center gap-2">
        <span className="w-1 h-6 bg-accent rounded-full" />
        Activity History
      </h2>

      <div className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-20 w-full rounded-xl bg-zinc-900" />
        ) : activities && activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-colors">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                    {activity.type}
                  </span>
                  <span className="text-zinc-500 text-xs font-mono">
                    {format(new Date(activity.completedAt!), "MMMM d, yyyy • h:mm a")}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">Interval Session</h3>
              </div>
              
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Duration</p>
                  <p className="font-mono font-bold text-white text-lg">
                    {Math.floor(activity.duration / 60)}m {activity.duration % 60}s
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Distance</p>
                  <p className="font-mono font-bold text-white text-lg">
                    {(activity.distance / 1000).toFixed(2)} km
                  </p>
                </div>
                <div className="text-right pl-8 border-l border-white/10">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Score</p>
                  <p className="font-mono font-black text-primary text-xl">+{activity.points}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-zinc-900/20 rounded-xl border border-dashed border-zinc-800">
            <p className="text-zinc-500">No activities recorded yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
