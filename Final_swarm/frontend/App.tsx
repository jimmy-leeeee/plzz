import React, { useState, useEffect } from 'react';
//import { generateStationData } from './services/mockDataService';
import { StationStatus, SystemState, Alert } from './types';
import DevOpsBar from './components/DevOpsBar';
import KpiGrid from './components/KpiGrid';
import ChartsSection from './components/ChartsSection';
import StationTable from './components/StationTable';
import AlertsPanel from './components/AlertsPanel';
import { LayoutDashboard } from 'lucide-react';
import { fetchStations } from './services/api';

const App: React.FC = () => {
  // State
  const [stations, setStations] = useState<StationStatus[]>([]);
  const [systemState, setSystemState] = useState<SystemState>({
    total_available: 0,
    total_in_use: 0,
    total_low_battery: 0,
    total_maintenance: 0,
    avg_trip_duration: 0,
    total_revenue_hr: 0,
    avg_latency: 0,
    avg_error_rate: 0
  });
  const [history, setHistory] = useState<{time: string, total_available: number, total_in_use: number}[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Simulation Loop
  useEffect(() => {
    // Initial Load
    updateData();

    // Loop interval (Simulating 5-min intervals, but sped up to 3s for demo purposes)
    const intervalId = setInterval(updateData, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const updateData = async () => {
  //const updateData = () => {
    //const newStationData = generateStationData();
    //setStations(newStationData);
    
    const newStationData = await fetchStations();
    setStations(newStationData);

    // Aggregate KPI Data
    const newState = newStationData.reduce((acc, curr) => ({
      total_available: acc.total_available + curr.available_vehicles,
      total_in_use: acc.total_in_use + curr.vehicles_in_use,
      total_low_battery: acc.total_low_battery + curr.low_battery_count,
      total_maintenance: acc.total_maintenance + curr.maintenance_required_count,
      avg_trip_duration: acc.avg_trip_duration + curr.avg_trip_duration_min,
      total_revenue_hr: acc.total_revenue_hr + curr.revenue_per_hour,
      avg_latency: acc.avg_latency + curr.api_latency_ms,
      avg_error_rate: acc.avg_error_rate + curr.error_rate_percent,
    }), {
      total_available: 0,
      total_in_use: 0,
      total_low_battery: 0,
      total_maintenance: 0,
      avg_trip_duration: 0,
      total_revenue_hr: 0,
      avg_latency: 0,
      avg_error_rate: 0
    });

    // Average out the non-sum metrics
    newState.avg_trip_duration = parseFloat((newState.avg_trip_duration / newStationData.length).toFixed(1));
    newState.avg_latency = parseFloat((newState.avg_latency / newStationData.length).toFixed(0));
    newState.avg_error_rate = parseFloat((newState.avg_error_rate / newStationData.length).toFixed(2));
    newState.total_revenue_hr = Math.floor(newState.total_revenue_hr);

    setSystemState(newState);

    // Update History for Charts (Keep last 20 points)
    const timeLabel = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
    setHistory(prev => {
      const newHistory = [...prev, {
        time: timeLabel,
        total_available: newState.total_available,
        total_in_use: newState.total_in_use
      }];
      if (newHistory.length > 20) return newHistory.slice(newHistory.length - 20);
      return newHistory;
    });

    // Generate Alerts based on PDF Logic
    const newAlerts: Alert[] = [];
    newStationData.forEach(st => {
      // P1: Empty Spot
      if (st.available_vehicles < 2) {
        newAlerts.push({
          id: `${st.station_id}-empty-${Date.now()}`,
          timestamp: st.timestamp,
          station_name: st.station_name,
          type: 'Empty Spot',
          priority: 'P1',
          message: `Only ${st.available_vehicles} vehicles available.`
        });
      }
      // P1: Full Spot
      if (st.utilization_rate > 90) {
        newAlerts.push({
          id: `${st.station_id}-full-${Date.now()}`,
          timestamp: st.timestamp,
          station_name: st.station_name,
          type: 'Full Spot',
          priority: 'P1',
          message: `Utilization at ${st.utilization_rate.toFixed(1)}%`
        });
      }
      // P2: High Charge Need (Low Battery > 50% of available?? PDF says "Low Battery Count > 50%")
      // Adjusted Logic: If Low Battery count > 50% of total available at that station (assumption based on context)
      // PDF text: "Low Battery Count 超過 50%" - let's assume raw count > 5 or ratio > 50%
      if (st.low_battery_count > 10) { 
        newAlerts.push({
          id: `${st.station_id}-batt-${Date.now()}`,
          timestamp: st.timestamp,
          station_name: st.station_name,
          type: 'High Charge',
          priority: 'P2',
          message: `${st.low_battery_count} vehicles need charging.`
        });
      }
      // P2: Maintenance Fault
      if (st.maintenance_required_count > 0) {
        newAlerts.push({
          id: `${st.station_id}-maint-${Date.now()}`,
          timestamp: st.timestamp,
          station_name: st.station_name,
          type: 'Maintenance Fault',
          priority: 'P2',
          message: `${st.maintenance_required_count} vehicles reported faulty.`
        });
      }
    });
    // Sort by priority then time
    newAlerts.sort((a, b) => a.priority === 'P1' ? -1 : 1);
    setAlerts(newAlerts);
  };

//bg-emerald-950  綠色  or   bg-slate-950   藍色 


  return (
    <div className="min-h-screen bg-emerald-950 text-slate-200 p-4 md:p-6 font-sans selection:bg-cyan-500/30">
      
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <LayoutDashboard className="text-cyan-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ScooterOps Dashboard
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Docker Swarm Cluster • Production Environment</p>
        </div>
        
        {/* DevOps Top Bar */}
        <DevOpsBar latency={systemState.avg_latency} errorRate={systemState.avg_error_rate} />
      </header>

      {/* Top Block: KPIs */}
      <KpiGrid data={systemState} />

      {/* Middle Block: Charts */}
      <ChartsSection history={history} />

      {/* Bottom Block: Table + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[500px]">
        <div className="xl:col-span-3 h-full">
          <StationTable stations={stations} />
        </div>
        <div className="xl:col-span-1 h-full">
          <AlertsPanel alerts={alerts} />
        </div>
      </div>

    </div>
  );
};

export default App;