import React from 'react';
import { StationStatus } from '../types';

interface Props {
  stations: StationStatus[];
}

const StationTable: React.FC<Props> = ({ stations }) => {
  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-lg overflow-hidden flex flex-col h-full shadow-lg backdrop-blur-sm">
      <div className="p-4 border-b border-slate-700 bg-slate-800/60 flex justify-between items-center">
        <h3 className="text-slate-200 font-semibold tracking-wide">Live Station Status</h3>
        <span className="text-xs font-mono text-cyan-500 animate-pulse">● LIVE DATA</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Station Name</th>
              <th className="px-4 py-3 text-right">Capacity</th>
              <th className="px-4 py-3 text-right">Available</th>
              <th className="px-4 py-3 text-right">In Use</th>
              <th className="px-4 py-3 text-right">Low Batt</th>
              <th className="px-4 py-3 text-right">Maint.</th>
              <th className="px-4 py-3 text-right">Util %</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {stations.map((station) => {
              // Status Indicator Logic
              let statusColor = "bg-emerald-500";
              if (station.utilization_rate > 90 || station.available_vehicles < 2) statusColor = "bg-red-500";
              else if (station.maintenance_required_count > 0 || station.low_battery_count > (station.available_vehicles * 0.5)) statusColor = "bg-yellow-500";

              return (
                <tr key={station.station_id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">#{station.station_id.toString().padStart(3, '0')}</td>
                  <td className="px-4 py-3 text-slate-200 font-medium text-sm">{station.station_name}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-sm text-right">{station.max_capacity}</td>
                  <td className="px-4 py-3 font-mono text-sm text-right font-bold text-cyan-400">{station.available_vehicles}</td>
                  <td className="px-4 py-3 font-mono text-sm text-right text-purple-400">{station.vehicles_in_use}</td>
                  <td className={`px-4 py-3 font-mono text-sm text-right ${station.low_battery_count > 5 ? 'text-yellow-500' : 'text-slate-400'}`}>
                    {station.low_battery_count}
                  </td>
                  <td className={`px-4 py-3 font-mono text-sm text-right ${station.maintenance_required_count > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    {station.maintenance_required_count}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="font-mono text-xs text-slate-300">{station.utilization_rate.toFixed(1)}%</span>
                      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${station.utilization_rate > 90 ? 'bg-red-500' : 'bg-cyan-500'}`} 
                          style={{ width: `${station.utilization_rate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className={`w-2.5 h-2.5 rounded-full mx-auto shadow-[0_0_8px] ${statusColor} ${statusColor === 'bg-red-500' ? 'shadow-red-500/50 animate-pulse' : 'shadow-emerald-500/50'}`}></div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StationTable;