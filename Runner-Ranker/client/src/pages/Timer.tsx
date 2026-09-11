import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateActivity } from "@/hooks/use-activities";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Save, Timer as TimerIcon, FastForward } from "lucide-react";
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useLocation } from "wouter";
import { toast } from "@/hooks/use-toast";

type TimerState = "idle" | "work" | "rest" | "finished";

export default function TimerPage() {
  const [, setLocation] = useLocation();
  const createActivity = useCreateActivity();
  
  // Configuration (Could be editable in future)
  const WORK_TIME = 60; // 1 min
  const REST_TIME = 30; // 30 sec
  const TOTAL_SETS = 5;

  // State
  const [status, setStatus] = useState<TimerState>("idle");
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [currentSet, setCurrentSet] = useState(1);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [distance, setDistance] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  // Total session duration accumulator
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if ((status === "work" || status === "rest") && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0; // Will reset in handlePhaseComplete
          }
          return prev - 1;
        });
        setTotalDuration(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status, isPaused]);

  const handlePhaseComplete = () => {
    if (status === "work") {
      if (currentSet >= TOTAL_SETS) {
        setStatus("finished");
        setShowSaveDialog(true);
      } else {
        setStatus("rest");
        setTimeLeft(REST_TIME);
      }
    } else if (status === "rest") {
      setCurrentSet((prev) => prev + 1);
      setStatus("work");
      setTimeLeft(WORK_TIME);
    }
  };

  const togglePause = () => setIsPaused(!isPaused);

  const resetTimer = () => {
    setStatus("idle");
    setTimeLeft(WORK_TIME);
    setCurrentSet(1);
    setIsPaused(false);
    setTotalDuration(0);
  };

  const startTimer = () => {
    setStatus("work");
    setIsPaused(false);
  };

  const handleSave = async () => {
    const distanceInMeters = Number(distance);
    if (!distance || !Number.isFinite(distanceInMeters) || distanceInMeters < 0) {
      toast({ title: "Invalid Distance", description: "Please enter a valid number.", variant: "destructive" });
      return;
    }

    try {
      await createActivity.mutateAsync({
        type: "interval",
        duration: totalDuration,
        distance: distanceInMeters,
        userColor: "#ccff00",
      });
      toast({ title: "Workout Saved!", description: "Great job on your intervals.", className: "bg-primary text-black border-none" });
      setLocation("/");
    } catch (e) {
      toast({ title: "Error", description: "Could not save workout.", variant: "destructive" });
    }
  };

  const getProgressColor = () => {
    if (status === "work") return "#ccff00"; // Neon Green
    if (status === "rest") return "#00ffff"; // Electric Blue
    return "#52525b"; // Zinc-600
  };

  const getProgressValue = () => {
    const total = status === "work" ? WORK_TIME : REST_TIME;
    return (timeLeft / total) * 100;
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md relative">
          
          {/* Header Stats */}
          <div className="flex justify-between items-center mb-8 px-4">
            <div className="text-center">
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Set</p>
              <p className="text-3xl font-mono font-bold text-white">{currentSet}<span className="text-zinc-600 text-lg">/{TOTAL_SETS}</span></p>
            </div>
            <div className="text-center">
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Time</p>
              <p className="text-3xl font-mono font-bold text-white">
                {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>

          {/* Main Circular Timer */}
          <div className="relative mb-12">
            <motion.div 
              animate={{ scale: status === "work" && !isPaused ? [1, 1.02, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="drop-shadow-[0_0_15px_rgba(204,255,0,0.1)]"
            >
              <CircularProgressbarWithChildren 
                value={getProgressValue()} 
                styles={buildStyles({
                  pathColor: getProgressColor(),
                  trailColor: '#18181b',
                  pathTransitionDuration: 0.5,
                  strokeLinecap: 'butt',
                })}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <motion.div
                    key={status}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-2"
                  >
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${
                      status === "work" ? "bg-primary/20 text-primary border-primary/50" :
                      status === "rest" ? "bg-secondary/20 text-secondary border-secondary/50" :
                      "bg-zinc-800 text-zinc-400 border-zinc-700"
                    }`}>
                      {status === "idle" ? "READY" : status}
                    </span>
                  </motion.div>
                  <p className="text-7xl font-mono font-black text-white tabular-nums tracking-tighter">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              </CircularProgressbarWithChildren>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-4">
            {status === "idle" ? (
              <Button 
                onClick={startTimer}
                className="col-span-2 h-16 text-xl font-bold rounded-2xl bg-primary text-black hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)]"
              >
                <Play className="w-6 h-6 mr-2 fill-current" /> START WORKOUT
              </Button>
            ) : (
              <>
                <Button 
                  onClick={togglePause}
                  variant="outline"
                  className={`h-16 text-lg font-bold rounded-2xl border-2 ${
                    isPaused ? "bg-primary/20 text-primary border-primary" : "bg-zinc-900 border-zinc-700 text-white"
                  }`}
                >
                  {isPaused ? <Play className="w-6 h-6 mr-2" /> : <Pause className="w-6 h-6 mr-2" />}
                  {isPaused ? "RESUME" : "PAUSE"}
                </Button>
                <Button 
                  onClick={resetTimer}
                  variant="destructive"
                  className="h-16 text-lg font-bold rounded-2xl bg-zinc-900 hover:bg-destructive/20 border-2 border-zinc-800 hover:border-destructive text-zinc-400 hover:text-destructive"
                >
                  <RotateCcw className="w-6 h-6 mr-2" /> RESET
                </Button>
              </>
            )}
          </div>
          
          {/* Debug/Skip Button (for demo purposes) */}
          {status !== "idle" && (
            <button 
              onClick={handlePhaseComplete} 
              className="w-full mt-4 text-xs text-zinc-700 uppercase font-bold hover:text-zinc-500 flex items-center justify-center gap-1"
            >
              Skip Phase <FastForward className="w-3 h-3" />
            </button>
          )}

        </div>
      </div>

      {/* Save Modal */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="bg-zinc-950 border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic uppercase text-primary">Workout Complete!</DialogTitle>
            <DialogDescription className="text-zinc-400 text-lg">
              You crushed {TOTAL_SETS} sets in {Math.floor(totalDuration / 60)} minutes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase text-zinc-500">Distance (meters)</label>
              <Input 
                type="number" 
                placeholder="e.g. 2400" 
                className="h-14 text-2xl font-mono bg-zinc-900 border-zinc-800 focus:border-primary text-white"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
              <p className="text-xs text-zinc-600">Enter total distance from your treadmill or watch.</p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleSave} 
              disabled={createActivity.isPending}
              className="w-full h-12 text-lg font-bold bg-primary text-black hover:bg-primary/90"
            >
              {createActivity.isPending ? "Saving..." : "Save & View Stats"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
