from flask import Flask
from flask_cors import CORS
from app.routers.stations import stations_bp
from app.routers.healthz import healthz_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    # /api/stations
    app.register_blueprint(stations_bp, url_prefix="/api")
    app.register_blueprint(healthz_bp, url_prefix="/api")

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
