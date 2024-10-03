const apiKey = 'efc394d61c103888bbd2e9d4673fc5cf';
const baseUrl = 'https://api.openweathermap.org/data/2.5';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const suggestions = document.getElementById('suggestions');
const weatherEmoji = document.getElementById('weatherEmoji');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const date = document.getElementById('date');
const forecastContainer = document.getElementById('forecastContainer');
const temperatureChart = document.getElementById('temperatureChart').getContext('2d');
const sevenDayTempChart = document.getElementById('sevenDayTempChart').getContext('2d');

const cities = [
  'New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Berlin', 'Moscow', 'Dubai',
  'Rome', 'Madrid', 'Amsterdam', 'Singapore', 'Hong Kong', 'Bangkok', 'Istanbul'
];

cityInput.addEventListener('input', () => {
  const value = cityInput.value.toLowerCase();
  const filteredCities = cities.filter(city => city.toLowerCase().startsWith(value));
  
  suggestions.innerHTML = '';
  filteredCities.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    li.addEventListener('click', () => {
      cityInput.value = city;
      suggestions.innerHTML = '';
      getWeatherData(city);
    });
    suggestions.appendChild(li);
  });
});

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
  }
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = cityInput.value.trim();
    if (city) {
      getWeatherData(city);
    }
  }
});

async function getWeatherData(city) {
  try {
    const currentWeather = await fetch(`${baseUrl}/weather?q=${city}&units=metric&appid=${apiKey}`).then(res => res.json());
    const forecast = await fetch(`${baseUrl}/forecast?q=${city}&units=metric&appid=${apiKey}`).then(res => res.json());
    
    updateCurrentWeather(currentWeather);
    updateForecast(forecast);
    updateCharts(forecast);  // This now calls the function from charts.js
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function updateCurrentWeather(data) {
  weatherEmoji.textContent = getWeatherEmoji(data.weather[0].id);
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind: ${data.wind.speed} m/s`;
  date.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function updateForecast(data) {
  forecastContainer.innerHTML = '';
  const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
  
  dailyData.forEach(day => {
    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');
    
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    forecastItem.innerHTML = `
      <p>${dayName}</p>
      <p>${getWeatherEmoji(day.weather[0].id)}</p>
      <p>${Math.round(day.main.temp)}°C</p>
    `;
    
    forecastContainer.appendChild(forecastItem);
  });
}

function updateCharts(data) {
  // This function should be implemented in charts.js
  if (typeof window.updateCharts === 'function') {
    window.updateCharts(data);
  }
}

function getWeatherEmoji(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return '⛈️';
  if (weatherId >= 300 && weatherId < 400) return '🌧️';
  if (weatherId >= 500 && weatherId < 600) return '🌦️';
  if (weatherId >= 600 && weatherId < 700) return '❄️';
  if (weatherId >= 700 && weatherId < 800) return '🌫️';
  if (weatherId === 800) return '☀️';
  if (weatherId > 800) return '☁️';
  return '🌡️';
}

// Get weather data for current location
function getCurrentLocationWeather() {
  console.log('Attempting to get current location...');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        console.log(`Location obtained: Lat ${latitude}, Lon ${longitude}`);
        fetch(`${baseUrl}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
          .then(res => res.json())
          .then(data => {
            console.log('Weather data fetched:', data);
            updateCurrentWeather(data);
            getWeatherData(data.name);
          })
          .catch(error => {
            console.error('Error fetching current location weather:', error);
            getWeatherData('New York'); // Fallback to default city
          });
      },
      error => {
        console.error('Error getting current location:', error);
        getWeatherData('New York'); // Fallback to default city
      },
      { timeout: 10000 } // Set a timeout of 10 seconds
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
    getWeatherData('New York'); // Fallback to default city
  }
}

// Call getCurrentLocationWeather when the page loads
document.addEventListener('DOMContentLoaded', getCurrentLocationWeather);