CREATE TABLE stations (
    station_id SERIAL PRIMARY KEY,
    station_name VARCHAR(100) UNIQUE NOT NULL,
    region_group VARCHAR(50),
    max_capacity INTEGER NOT NULL CHECK (max_capacity > 0)
);
CREATE TABLE vehicle_metrics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    station_id INTEGER NOT NULL REFERENCES stations(station_id),

    available_vehicles INTEGER NOT NULL CHECK (available_vehicles >= 0),
    vehicles_in_use INTEGER NOT NULL CHECK (vehicles_in_use >= 0),
    low_battery_count INTEGER NOT NULL CHECK (low_battery_count >= 0),
    maintenance_required_count INTEGER NOT NULL CHECK (maintenance_required_count >= 0),

    revenue_per_hour NUMERIC(10,2) NOT NULL CHECK (revenue_per_hour >= 0),
    avg_trip_duration_min NUMERIC(5,2) NOT NULL CHECK (avg_trip_duration_min >= 0),

    api_latency_ms NUMERIC(6,2) NOT NULL CHECK (api_latency_ms >= 0),
    error_rate_percent NUMERIC(4,2) NOT NULL CHECK (error_rate_percent >= 0 AND error_rate_percent <= 100)
);

CREATE INDEX idx_vehicle_metrics_timestamp
ON vehicle_metrics (timestamp);
CREATE INDEX idx_vehicle_metrics_station_time
ON vehicle_metrics (station_id, timestamp);

INSERT INTO stations (station_name, region_group, max_capacity) VALUES
('Tainan Station Front', 'Central-A', 100),
('NYCU Chimei Building', 'Campus-B', 50),
('Anping Tree House Spot', 'Tourist-C', 120);