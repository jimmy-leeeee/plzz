import React from 'react';
import { Activity, ServerCrash, Zap } from 'lucide-react';

interface Props {
  latency: number;
  errorRate: number;
}

const DevOpsBar: React.FC<Props> = ({ latency, errorRate }) => {
  // Determine color based on health
  const latencyColor = latency > 100 ? 'text-yellow-400' : 'text-emerald-400';
  const errorColor = errorRate > 1.0 ? 'text-red-500' : 'text-emerald-400';

  return (
    <div className="flex items-center space-x-6 bg-slate-900/50 rounded-lg px-4 py-2 border border-slate-800">
      <div className="flex items-center space-x-2">
        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Cluster Status</span>
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
      </div>
      
      <div className="h-4 w-px bg-slate-700"></div>

      <div className="flex items-center space-x-2">
        <Activity size={14} className="text-cyan-400" />
        <span className="text-slate-400 text-xs">Avg Latency:</span>
        <span className={`text-sm font-mono font-bold ${latencyColor}`}>{latency.toFixed(0)} ms</span>
      </div>

      <div className="flex items-center space-x-2">
        <ServerCrash size={14} className="text-cyan-400" />
        <span className="text-slate-400 text-xs">Error Rate:</span>
        <span className={`text-sm font-mono font-bold ${errorColor}`}>{errorRate.toFixed(2)}%</span>
      </div>

      <div className="flex-grow"></div>
      
      <div className="flex items-center space-x-1 text-slate-500 text-xs">
        <Zap size={12} />
        <span>Swarm Worker: Active</span>
      </div>
    </div>
  );
};

export default DevOpsBar;