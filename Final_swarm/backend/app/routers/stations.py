from flask import Blueprint, jsonify
from db import get_connection
import traceback
import psycopg2.extras

stations_bp = Blueprint("stations", __name__)

@stations_bp.route("/stations", methods=["GET"])
def get_stations():
    try:
        #conn = get_connection()
        #cursor = conn.cursor()
        
        conn = get_connection()
        # ✅ 用 dict cursor，row["station_id"] 才會正常
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)


        query = """
        SELECT 
            s.station_id,
            s.station_name,
            s.region_group,
            s.max_capacity,
            vm.timestamp,
            vm.available_vehicles,
            vm.vehicles_in_use,
            vm.low_battery_count,
            vm.maintenance_required_count,
            vm.revenue_per_hour,
            vm.avg_trip_duration_min,
            vm.api_latency_ms,
            vm.error_rate_percent
        FROM stations s
        LEFT JOIN LATERAL (
            SELECT *
            FROM vehicle_metrics
            WHERE station_id = s.station_id
            ORDER BY timestamp DESC
            LIMIT 1
        ) vm ON true
        ORDER BY s.station_id;
        """

        cursor.execute(query)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        """
        stations = []
        for row in rows:
            stations.append({
                "station_id": row["station_id"],
                "station_name": row["station_name"],
                "region_group": row["region_group"],
                "max_capacity": row["max_capacity"],
                "timestamp": row["timestamp"].isoformat() if row["timestamp"] else None,
                "available_vehicles": row["available_vehicles"] or 0,
                "vehicles_in_use": row["vehicles_in_use"] or 0,
                "low_battery_count": row["low_battery_count"] or 0,
                "maintenance_required_count": row["maintenance_required_count"] or 0,
                "revenue_per_hour": float(row["revenue_per_hour"] or 0),
                "avg_trip_duration_min": float(row["avg_trip_duration_min"] or 0),
                "api_latency_ms": float(row["api_latency_ms"] or 0),
                "error_rate_percent": float(row["error_rate_percent"] or 0),
                "utilization_rate": round((row["vehicles_in_use"] / row["max_capacity"] * 100), 2)
                    if row["max_capacity"] and row["vehicles_in_use"] else 0,
            })
        """
        
        stations = []
        for row in rows:
            # 先把欄位拉出來處理 None / 0
            max_capacity = row.get("max_capacity")
            available_vehicles = row.get("available_vehicles") or 0
            vehicles_in_use = row.get("vehicles_in_use") or 0
            low_battery_count = row.get("low_battery_count") or 0
            maintenance_required_count = row.get("maintenance_required_count") or 0
            revenue_per_hour = float(row.get("revenue_per_hour") or 0)
            avg_trip_duration_min = float(row.get("avg_trip_duration_min") or 0)
            api_latency_ms = float(row.get("api_latency_ms") or 0)
            error_rate_percent = float(row.get("error_rate_percent") or 0)

            # 利用率：只要 max_capacity 有值就算，vehicles_in_use = 0 會得到 0%
            if max_capacity:
                utilization_rate = round(vehicles_in_use / max_capacity * 100, 2)
            else:
                utilization_rate = 0

            stations.append({
                "station_id": row.get("station_id"),
                "station_name": row.get("station_name"),
                "region_group": row.get("region_group"),
                "max_capacity": max_capacity,
                "timestamp": row.get("timestamp").isoformat() if row.get("timestamp") else None,
                "available_vehicles": available_vehicles,
                "vehicles_in_use": vehicles_in_use,
                "low_battery_count": low_battery_count,
                "maintenance_required_count": maintenance_required_count,
                "revenue_per_hour": revenue_per_hour,
                "avg_trip_duration_min": avg_trip_duration_min,
                "api_latency_ms": api_latency_ms,
                "error_rate_percent": error_rate_percent,
                "utilization_rate": utilization_rate,
            })

        return jsonify(stations), 200

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500
