import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

interface HistoryPoint {
  time: string;
  total_available: number;
  total_in_use: number;
}

interface Props {
  history: HistoryPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl">
        <p className="text-slate-300 text-xs mb-2 font-mono">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm font-bold font-mono">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartsSection: React.FC<Props> = ({ history }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Chart 1: Available Trend */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4 shadow-lg backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-transparent opacity-50"></div>
        <h3 className="text-slate-300 font-semibold mb-4 flex items-center">
          <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
          Available Vehicles Trend
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorAvail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis 
                dataKey="time" 
                stroke="#94a3b8" 
                tick={{fontSize: 10, fontFamily: 'monospace'}} 
                tickLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                tick={{fontSize: 10, fontFamily: 'monospace'}} 
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="total_available" 
                name="Available" 
                stroke="#22d3ee" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorAvail)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Usage Trend */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4 shadow-lg backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent opacity-50"></div>
        <h3 className="text-slate-300 font-semibold mb-4 flex items-center">
          <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
          In-Use Vehicles Trend
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorUse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis 
                dataKey="time" 
                stroke="#94a3b8" 
                tick={{fontSize: 10, fontFamily: 'monospace'}} 
                tickLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                tick={{fontSize: 10, fontFamily: 'monospace'}} 
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="total_in_use" 
                name="In Use" 
                stroke="#c084fc" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUse)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;