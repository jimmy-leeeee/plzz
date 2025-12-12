export interface Station {
  station_id: number;
  station_name: string;
  region_group: string;
  max_capacity: number;
}

export interface VehicleMetrics {
  timestamp: string; // ISO String
  station_id: number;
  available_vehicles: number;
  vehicles_in_use: number;
  low_battery_count: number;
  maintenance_required_count: number;
  // Financial & UX
  revenue_per_hour: number;
  avg_trip_duration_min: number;
  // DevOps
  api_latency_ms: number;
  error_rate_percent: number;
}

// Combined type for UI display (Station info + Current Metrics)
export interface StationStatus extends Station, VehicleMetrics {
  utilization_rate: number; // Calculated field
}

export interface Alert {
  id: string;
  timestamp: string;
  station_name: string;
  type: 'Empty Spot' | 'Full Spot' | 'High Charge' | 'Maintenance Fault';
  priority: 'P1' | 'P2';
  message: string;
}

// Aggregated System Data for Top/Middle Blocks
export interface SystemState {
  total_available: number;
  total_in_use: number;
  total_low_battery: number;
  total_maintenance: number;
  avg_trip_duration: number;
  total_revenue_hr: number;
  avg_latency: number;
  avg_error_rate: number;
}