import requests
from dotenv import load_dotenv
import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Loading the API key from the .env file
load_dotenv()
api_key = os.getenv('API_KEY')
GEO_BASE_URL = "http://api.openweathermap.org/geo/1.0/direct"
WEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5/weather"


@app.route('/')
def index():
    return render_template('index.html')


    
@app.route('/weather', methods=['GET', 'POST'])
def get__weather():

    city = request.args.get('city')
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if city:
        current_weather_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}"
        forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}"
    elif lon and lat:
        current_weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}"
        forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}"
    else:
        return jsonify({'error': 'City or coordinates are required'}), 400
    
    try:
        current_response = requests.get(current_weather_url)
        current_data = current_response.json()

       

        forecast_response = requests.get(forecast_url)
        forecast_data = forecast_response.json()
     

        return jsonify({
            "current_weather": current_data,
            "forecast": forecast_data
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
   


if __name__ == '__main__':
    app.run()