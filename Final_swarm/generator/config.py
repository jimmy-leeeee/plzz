import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "db")
DB_PORT = int(os.getenv("DB_PORT", 5432))
DB_NAME = os.getenv("DB_NAME", "mydb")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")

GENERATE_INTERVAL_SECONDS = int(os.getenv("GENERATE_INTERVAL_SECONDS", 300))  # 預設 5 分鐘

# 高峰時段 [(開始小時, 結束小時)]
# 用逗號分隔多組時段，例如 "7,9;17,19"
peak_hours_str = os.getenv("PEAK_HOURS", "7,9;17,19")
PEAK_HOURS = [tuple(map(int, h.split(","))) for h in peak_hours_str.split(";")]