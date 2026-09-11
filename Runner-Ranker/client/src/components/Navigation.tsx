import { Link, useLocation } from "wouter";
import { LayoutDashboard, Timer, Trophy, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Stats" },
    { href: "/timer", icon: Timer, label: "Run" },
    { href: "/leaderboard", icon: Trophy, label: "Rank" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-zinc-950/90 backdrop-blur-lg border-t border-white/10 safe-area-bottom">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-1 group">
                  <item.icon 
                    className={cn(
                      "w-6 h-6 transition-all duration-300",
                      isActive ? "text-primary stroke-[2.5px] drop-shadow-[0_0_8px_rgba(204,255,0,0.6)]" : "text-zinc-500 group-hover:text-zinc-300"
                    )} 
                  />
                  <span className={cn(
                    "text-[10px] uppercase font-bold tracking-wider",
                    isActive ? "text-primary" : "text-zinc-500"
                  )}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-zinc-950 border-r border-white/10 z-50 p-6">
        <div className="mb-12">
          <h1 className="text-3xl font-black italic tracking-tighter">
            <span className="text-primary">INT</span>VL
          </h1>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}>
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
                )}
                <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                <span className="font-bold uppercase tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden">
              {user.profileImageUrl && (
                <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-white">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-zinc-500 truncate">@{user.email?.split("@")[0] || 'runner'}</p>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-zinc-500 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
