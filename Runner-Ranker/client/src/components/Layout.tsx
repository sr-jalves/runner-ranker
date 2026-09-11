import { ReactNode } from "react";
import { Navigation } from "./Navigation";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-64">
      <Navigation />
      <main className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}
