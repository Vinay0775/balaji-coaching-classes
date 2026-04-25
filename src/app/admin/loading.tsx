import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin relative z-10" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Loading Workspace...</h2>
      <p className="text-slate-400 text-sm max-w-xs">Fetching latest data for admin panel.</p>
    </div>
  );
}
