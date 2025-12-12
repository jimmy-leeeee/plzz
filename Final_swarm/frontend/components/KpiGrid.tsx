import React from 'react';
import { Bike, Users, BatteryWarning, Wrench, Clock, DollarSign } from 'lucide-react';
import { SystemState } from '../types';

interface Props {
  data: SystemState;
}

const KpiCard = ({ title, value, unit, icon: Icon, colorClass, borderClass }: any) => (
  <div className={`bg-slate-800/60 backdrop-blur-sm border-l-4 ${borderClass} rounded-r-lg p-4 flex items-center justify-between shadow-lg`}>
    <div>
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
      <div className="flex items-baseline space-x-1">
        <span className={`text-2xl font-mono font-bold ${colorClass}`}>{value}</span>
        {unit && <span className="text-slate-500 text-xs">{unit}</span>}
      </div>
    </div>
    <div className={`p-2 rounded-full bg-slate-900/50 ${colorClass}`}>
      <Icon size={20} />
    </div>
  </div>
);

const KpiGrid: React.FC<Props> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <KpiCard 
        title="Total Available" 
        value={data.total_available} 
        icon={Bike} 
        colorClass="text-cyan-400" 
        borderClass="border-cyan-500"
      />
      <KpiCard 
        title="Active Trips" 
        value={data.total_in_use} 
        icon={Users} 
        colorClass="text-purple-400" 
        borderClass="border-purple-500"
      />
      <KpiCard 
        title="Low Battery" 
        value={data.total_low_battery} 
        icon={BatteryWarning} 
        colorClass="text-yellow-400" 
        borderClass="border-yellow-500"
      />
      <KpiCard 
        title="Maintenance" 
        value={data.total_maintenance} 
        icon={Wrench} 
        colorClass="text-red-400" 
        borderClass="border-red-500"
      />
      <KpiCard 
        title="Avg Duration" 
        value={data.avg_trip_duration.toFixed(1)} 
        unit="min"
        icon={Clock} 
        colorClass="text-emerald-400" 
        borderClass="border-emerald-500"
      />
      <KpiCard 
        title="Revenue/Hr" 
        value={data.total_revenue_hr.toLocaleString()} 
        unit="$"
        icon={DollarSign} 
        colorClass="text-blue-400" 
        borderClass="border-blue-500"
      />
    </div>
  );
};

export default KpiGrid;