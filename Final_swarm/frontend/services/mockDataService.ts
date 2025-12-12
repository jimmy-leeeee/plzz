import { Station, StationStatus } from '../types';

// Defined in PDF SQL initialization
const STATIONS: Station[] = [
  { station_id: 1, station_name: 'Tainan Station Front', region_group: 'Central-A', max_capacity: 100 },
  { station_id: 2, station_name: 'NYCU Chimei Building', region_group: 'Campus-B', max_capacity: 50 },
  { station_id: 3, station_name: 'Anping Tree House Spot', region_group: 'Tourist-C', max_capacity: 120 },
  { station_id: 4, station_name: 'Science Park North', region_group: 'Tech-D', max_capacity: 80 },
  { station_id: 5, station_name: 'Hayashi Department Store', region_group: 'Central-A', max_capacity: 60 },
];

// Helper to generate random number in range
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
const randomFloat = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

export const generateStationData = (): StationStatus[] => {
  const timestamp = new Date().toISOString();

  return STATIONS.map(station => {
    // Logic to simulate realistic counts based on capacity
    const inUse = randomInt(Math.floor(station.max_capacity * 0.2), Math.floor(station.max_capacity * 0.95));
    const available = station.max_capacity - inUse;
    
    // Subsets of available
    const lowBattery = randomInt(0, Math.floor(available * 0.6)); 
    const maintenance = randomInt(0, Math.floor(available * 0.1));

    // DevOps stats (Global simulation but applied per row for simplicity in structure)
    const latency = randomInt(20, 150); // ms
    const errorRate = Math.random() > 0.9 ? randomFloat(0.1, 2.5) : 0; // occasional spikes

    const utilization = (inUse / station.max_capacity) * 100;

    return {
      ...station,
      timestamp,
      available_vehicles: available,
      vehicles_in_use: inUse,
      low_battery_count: lowBattery,
      maintenance_required_count: maintenance,
      revenue_per_hour: randomFloat(500, 3000),
      avg_trip_duration_min: randomFloat(8, 25),
      api_latency_ms: latency,
      error_rate_percent: errorRate,
      utilization_rate: utilization
    };
  });
};