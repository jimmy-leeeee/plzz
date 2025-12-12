import time
import data_generator
import config
import psycopg2

def wait_for_db():
    while True:
        try:
            conn = data_generator.connect_db()
            conn.close()
            print("DB ready!")
            break
        except psycopg2.OperationalError:
            print("DB not ready, retrying in 3 seconds...")
            time.sleep(3)

def fetch_stations():
    conn = data_generator.connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT station_id, max_capacity FROM stations;")
    stations = [{"station_id": r[0], "max_capacity": r[1]} for r in cursor.fetchall()]
    cursor.close()
    conn.close()
    return stations

def run_scheduler():
    wait_for_db()
    stations = fetch_stations()
    while True:
        batch = [data_generator.generate_metrics(s) for s in stations]
        try:
            data_generator.insert_metrics(batch)
            print(f"{len(batch)} records inserted at {batch[0]['timestamp']}")
        except Exception as e:
            print("DB insert failed:", e)
        time.sleep(config.GENERATE_INTERVAL_SECONDS)

if __name__ == "__main__":
    run_scheduler()
