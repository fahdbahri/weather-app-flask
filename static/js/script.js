
// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    getUserLocation();
});


function handleSearch() {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city');
        return;
    }
    getWeather(city);
} 

function getWeather(city = null) {
    const weatherUrl = city 
        ? `/weather?city=${encodeURIComponent(city)}`
        : '/weather';
    
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data.current_weather);
            displayForecast(data.forecast);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        });
}

function displayCurrentWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const weatherHtml = `
        <p>${cityName}</p>
        <p>${description}</p>
        `;

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;
       
        weatherInfoDiv.innerHTML = weatherHtml;
        tempDivInfo.innerHTML = temperatureHTML;
       
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        weatherIcon.style.display = 'block';
    }
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '<h3>5-Day Forecast</h3>';

    const dailyForecasts = data.list.filter((item, index) => index % 8 === 0);

    dailyForecasts.forEach(item => {
        const date = new Date(item.dt * 1000); // Convert Unix timestamp to JavaScript object 
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temperature = Math.round(item.main.temp - 273.15);
        const description = item.weather[0].description;
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const forecastItemHtml = `
            <div class="forecast-item">
                <span>${dayName}</span>
                <img src="${iconUrl}" alt="Weather Icon">
                <span>${temperature}°C</span>
                <span>${description}</span>
            </div>
        `;
        forecastDiv.innerHTML += forecastItemHtml;
    });
}

// Get the user's location to display the location's weather
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetch(`/weather?lat=${lat}&lon=${lon}`)
                    .then(response => response.json())
                    .then(data => {
                        displayCurrentWeather(data.current_weather);
                        displayForecast(data.forecast);
                    })
                    .catch(error => {
                        console.error('Error fetching weather data:', error);
                        alert('Error fetching weather data. Please try again.');
                    });
            },
            error => {
                console.error('Error getting user location:', error);
                alert('Unable to get your location. Please enter a city manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser. Please enter a city manually.');
    }
}

// Call getUserLocation when the page loads
window.onload = getUserLocation;