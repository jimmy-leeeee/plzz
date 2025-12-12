from flask import Blueprint, jsonify
from db import get_connection

healthz_bp = Blueprint("healthz", __name__)

@healthz_bp.route("/healthz", methods=["GET"])
def healthz():
    """健康檢查端點"""
    try:
        # 測試資料庫連線
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        cursor.close()
        conn.close()
        
        return jsonify({"status": "ok", "db": "connected"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500