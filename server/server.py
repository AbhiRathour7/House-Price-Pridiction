from flask import Flask, request, jsonify
import util  # Make sure util.py is in the same folder
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from HTML/JS

# Endpoint to get location list
@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    try:
        locations = util.get_location_names()
        return jsonify({'locations': locations})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to predict home price
@app.route('/predict_home_price', methods=['POST'])  # Frontend sends form-data POST
def predict_home_price():
    try:
        total_sqft = float(request.form['total_sqft'])
        location = request.form['location']
        bhk = int(request.form['bhk'])
        bath = int(request.form['bath'])

        estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)

        return jsonify({
            'estimated_price': estimated_price
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the Flask app
if __name__ == "__main__":
    print("✅ Starting Flask Server for Home Price Prediction...")
    util.load_saved_artifacts()
    app.run(debug=True)