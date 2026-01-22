from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Database
app.config["JSON_AS_ASCII"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///pizzeria.sqlite?charset=utf8"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# ------------
# Measurement table
# ------------
class Measurement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dev_id = db.Column(db.Integer, nullable=False)
    percentage = db.Column(db.Float, nullable=False)
    decibels = db.Column(db.Float, nullable=False)

# ------------
# functions
# ------------
def seed_data():
    # x -92,75m y 35,34
    measurements = [
        Measurement(dev_id=1,percentage=60,decibels=10),
        Measurement(dev_id=2,percentage=30,decibels=20),
        Measurement(dev_id=3,percentage=78,decibels=25)
    ]
    db.session.add_all(measurements)
    db.session.commit()

# ------------
# endpoints for measurements
# ------------
@app.route("/measurements", methods=["GET"])
def get_measurements():
    measurements = Measurement.query.all()
    response = []

    for measurement in measurements:

        response.append(
            {
                "id": measurement.id,
                "dev_id": measurement.dev_id,
                "percentage": measurement.percentage,
                "decibels": measurement.decibels,
            }
        )

    return jsonify(response)

@app.route("/new-measurements", methods=["GET"])
def get_new_measurements():
    # measurements = Measurement.query.order_by(db.desc(Measurement.id)).group_by(Measurement.dev_id).all()
    measurements = Measurement.query.order_by(db.desc(Measurement.id)).all()
    response = []
    seen_dev_ids = set()
    
    for measurement in measurements:
        if (measurement.dev_id not in seen_dev_ids) :
            response.append(
                {
                    "id": measurement.id,
                    "dev_id": measurement.dev_id,
                    "percentage": measurement.percentage,
                    "decibels": measurement.decibels,
                }
            )
            seen_dev_ids.add(measurement.dev_id) 
            
    return jsonify(response)

@app.route("/measurements/posting", methods=["POST"])
def post_measurement():
    data = request.json
    
    # Check for missing or invalid input
    if (
        not data
        or "dev_id" not in data
        or "percentage" not in data
        or "decibels" not in data
    ):
        return jsonify({"message": "Invalid input"}), 400
    
    measurement = Measurement(
        dev_id=data["dev_id"],
        percentage=data["percentage"],
        decibels=data["decibels"]
    )
    if (measurement.percentage > 100 or measurement.percentage < 0):
        return jsonify({"message": "percentage not in range"}), 400
    
    db.session.add(measurement)
    db.session.commit()
    
    return (
        jsonify(
            {
                "message": "Measurement posted successfully",
                "id": measurement.id,
            }
        ),
        201,
    )


# ------------
# building the server
# ------------
if __name__ == "__main__":
    with app.app_context():
        db.drop_all()
        db.create_all()
        seed_data()
    app.run(host="0.0.0.0", port=5000)

