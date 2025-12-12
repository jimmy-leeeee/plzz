import random
from datetime import datetime
import psycopg2
from config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, PEAK_HOURS

# 儲存每個站點的上一筆資料
_prev_metrics = {}

def connect_db():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

def is_peak_hour():
    hour = datetime.utcnow().hour
    for start, end in PEAK_HOURS:
        if start <= hour < end:
            return True
    return False

def generate_metrics(station):
    global _prev_metrics
    max_cap = station["max_capacity"]
    station_id = station["station_id"]

    prev = _prev_metrics.get(station_id)

    peak = is_peak_hour()
    # 非尖峰 ±5，尖峰 ±15~30
    if prev:
        delta = random.randint(-5, 5) if not peak else random.randint(-15, 30)
        available = max(0, min(max_cap, prev["available_vehicles"] + delta))
    else:
        available = random.randint(0, max_cap)

    in_use = max_cap - available

    # low_battery 隨使用量決定，高峰期略多
    if peak:
        low_battery = int(in_use * random.uniform(0.1, 0.3))
    else:
        low_battery = int(in_use * random.uniform(0.05, 0.15))

    maintenance_required = random.randint(0, 2)
    revenue_per_hour = in_use * 10
    avg_trip_duration_min = random.uniform(5, 20)
    api_latency_ms = random.uniform(40, 100)
    error_rate_percent = random.uniform(0, 3)

    metrics = {
        "station_id": station_id,
        "timestamp": datetime.utcnow(),
        "available_vehicles": available,
        "vehicles_in_use": in_use,
        "low_battery_count": low_battery,
        "maintenance_required_count": maintenance_required,
        "revenue_per_hour": revenue_per_hour,
        "avg_trip_duration_min": avg_trip_duration_min,
        "api_latency_ms": api_latency_ms,
        "error_rate_percent": error_rate_percent
    }

    _prev_metrics[station_id] = metrics
    return metrics

def insert_metrics(batch):
    conn = connect_db()
    cursor = conn.cursor()
    for m in batch:
        cursor.execute("""
            INSERT INTO vehicle_metrics 
            (station_id, timestamp, available_vehicles, vehicles_in_use, low_battery_count, 
            maintenance_required_count, revenue_per_hour, avg_trip_duration_min, api_latency_ms, error_rate_percent)
            VALUES (%(station_id)s, %(timestamp)s, %(available_vehicles)s, %(vehicles_in_use)s, %(low_battery_count)s,
            %(maintenance_required_count)s, %(revenue_per_hour)s, %(avg_trip_duration_min)s, %(api_latency_ms)s, %(error_rate_percent)s)
        """, m)
    conn.commit()
    cursor.close()
    conn.close()