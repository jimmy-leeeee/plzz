import React from 'react';
import { AlertTriangle, AlertOctagon } from 'lucide-react';
import { Alert } from '../types';

interface Props {
  alerts: Alert[];
}

const AlertsPanel: React.FC<Props> = ({ alerts }) => {
  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-lg flex flex-col h-full shadow-lg backdrop-blur-sm">
      <div className="p-4 border-b border-slate-700 bg-slate-800/60 flex justify-between items-center">
        <h3 className="text-slate-200 font-semibold tracking-wide flex items-center">
          <AlertOctagon className="mr-2 text-red-500" size={18} />
          Active Alerts
        </h3>
        <span className="bg-red-500/20 text-red-400 text-xs font-mono px-2 py-0.5 rounded border border-red-500/30">
          {alerts.length} Active
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[300px] lg:max-h-full scrollbar-thin">
        {alerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
            <AlertTriangle size={32} className="mb-2" />
            <span className="text-sm">No Active Alerts</span>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`p-3 rounded border-l-4 transition-all animate-in slide-in-from-right duration-300 ${
                alert.priority === 'P1' 
                  ? 'bg-red-950/30 border-red-500' 
                  : 'bg-yellow-950/30 border-yellow-500'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-bold px-1.5 rounded ${
                  alert.priority === 'P1' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
                }`}>
                  {alert.priority}
                </span>
                <span className="text-slate-500 text-[10px] font-mono">{alert.timestamp.split('T')[1].split('.')[0]}</span>
              </div>
              <p className={`text-sm font-semibold mb-0.5 ${
                alert.priority === 'P1' ? 'text-red-200' : 'text-yellow-200'
              }`}>
                {alert.type}
              </p>
              <p className="text-xs text-slate-400 mb-1">
                {alert.station_name}
              </p>
              <p className="text-[11px] text-slate-500 italic">
                {alert.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;