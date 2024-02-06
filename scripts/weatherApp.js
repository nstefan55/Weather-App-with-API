import {
  renderWeatherInputFades,
  submitCityAndHideHeading,
  hideHeadingTitle,
  showHeadingTitle,
} from './Weather Input/input.js';

import { gsapHeadingAnimation } from '../scripts/Animations/animations.js';

renderWeatherInputFades();

gsapHeadingAnimation();

submitCityAndHideHeading();

const weatherForm = document.getElementById('weather-form');

const cityInput = document.querySelector('.js-weather-city-input');

const apiKey = '889ae0d6257b33c9fc650c6c39d0c81e';

let timeoutId;

weatherForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const city = cityInput.value;

  clearTimeout(timeoutId);

  if (city) {
    try {
      const currentWeatherData = await getCurrentWeatherData(city);

      displayWeatherInfo(currentWeatherData);
    } catch (error) {
      console.log(error);
      displayError(error);
    }
  } else {
    displayError('Please Enter a City!');
    document.querySelector('.errorContainer').classList.remove('displayNone');
  }
});

async function getCurrentWeatherData(city) {
  const apiCurrentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  const responseCurrentWeather = await fetch(apiCurrentWeatherURL);

  if (!responseCurrentWeather.ok) {
    throw new Error('Could not retrieve current weather data.');
  }

  return await responseCurrentWeather.json();
}

function displayWeatherInfo(data) {
  hideHeadingTitle();

  console.log(data);

  const weatherContent = document.querySelector('.js-main-weather-content');

  for (let index in data) {
    let {
      main: { feels_like, humidity, pressure, temp, temp_max, temp_min },
      name: city,
      sys: { sunrise, sunset },
      visibility: visibility,
      weather: [{ description, id }],
      wind: { speed, deg },
    } = data;

    if (
      cityInput.value === 'zagreb' ||
      cityInput.value === 'Zagreb' ||
      cityInput.value === 'Grad Zagreb' ||
      cityInput.value === 'grad zagreb'
    ) {
      city = 'Zagreb';
    }

    let unix_sunset = sunset;

    let sunsetDate = new Date(unix_sunset * 1000);

    let sunsetHours = sunsetDate.getHours();

    let sunsetMinutes = '0' + sunsetDate.getMinutes();

    let formatedSunset = sunsetHours + ':' + sunsetMinutes.substr(-2);

    let unix_sunrise = sunrise;

    let sunriseDate = new Date(unix_sunrise * 1000);

    let sunriseHours = sunriseDate.getHours();

    let sunriseMinutes = '0' + sunriseDate.getMinutes();

    let formatedSunrise = sunriseHours + ':' + sunriseMinutes.substr(-2);

    const weatherHtml = `<div class="weather-card container-grid">
      <div class="city-container">
        <h1 class="cityDisplay">${city}</h1>
        <p class="weatherIcon"></p>
      </div>

      <div class="temp-container">
        <p class="tempDisplay">${formatToCelcius(temp)} °C</p>
      </div>
      <div class="humidity-container">
        <p class="humidityDisplay">Humidity</p>
        <p class="humidityPercentDisplay">${humidity}%</p>
      </div>
      <p class="descDisplay">${description}</p>

      <div class="high-low-temp-container">
        <p class="high-tempDisplay">H: ${formatMaxToCelcius(temp_max)} °C</p>
        <p class="low-tempDisplay">L: ${formatMinToCelcius(temp_min)} °C</p>
      </div>
    </div>

    <br /><br />

    <div class="flex-container">
      <div class="weather-card card-60-percent">
        <div class="wind-container">
          <h1 class="windDisplay">Wind</h1>
        </div>
        <div class="second-grid-container">
          <p class="wind-km-display">${speed.toFixed(1)} m/s</p>
          <p class="wind-deg-display">${deg.toFixed(1)} deg</p>
        </div>
      </div>

      <div class="weather-card card-40-percent">
        <div class="feelsLike-container">
          <h1 class="windDisplay">Feels Like</h1>
        </div>
        <div class="flex-column">
          <p class="feels-like-display">${formatFeelsTemp(feels_like)} °C</p>
        </div>
      </div>
    </div>

    <br /><br />

    <div class="flex-container">
      <div class="weather-card card-40-percent m-l-4 m-r-2">
        <div class="pressure-container">
          <h1 class="pressureDisplay">Pressure</h1>
        </div>
        <div class="flex-column">
          <p class="pressure-parameter">${pressure} hPa</p>
        </div>
      </div>

      <div class="weather-card card-40-percent">
        <div class="feelsLike-container">
          <h1 class="visibilityDisplay">Visibility</h1>
        </div>
        <div class="flex-column">
          <p class="distanceParameterDisplay">${convertIntoKm(
            visibility
          )} km</p>
        </div>
      </div>
    </div>

    <br /><br />

    <div class="flex-container">
      <div
        class="weather-card weather-card-longer card-40-percent m-l-4 m-r-2"
      >
        <div class="sunset-container">
          <h1 class="sunsetDisplay">Sunset</h1>
        </div>
        <div class="flex-column">
          <p class="sunsetTime">${formatedSunset}</p>
        </div>
      </div>

      <div class="weather-card weather-card-longer card-40-percent">
        <div class="sunrise-container">
          <h1 class="sunriseDisplay">Sunrise</h1>
        </div>
        <div class="flex-column">
          <p class="sunsetTime">${formatedSunrise}</p>
        </div>
      </div>
    </div>
    `;
    weatherContent.innerHTML = weatherHtml;

    const errorContainer = document.querySelector('.errorContainer');

    errorContainer.innerHTML = '';

    errorContainer.classList.remove('messageDisplay');
  }
}

function getWeatherEmoji(weatherId) {}

function displayError(message) {
  document.querySelector('.js-main-weather-content').innerHTML = '';

  const errorMessage = document.querySelector('.errorContainer');

  errorMessage.classList.add('messageDisplay');

  errorMessage.innerHTML = message;

  timeoutId = setTimeout(() => {
    document.querySelector('.errorContainer').classList.add('displayNone');
    showHeadingTitle();
  }, 8000);
}

function formatToCelcius(temp) {
  return Math.round(temp - 273.15).toFixed(1);
}

function formatFeelsTemp(feels_like) {
  return Math.round(feels_like - 273.15).toFixed(1);
}

function formatMinToCelcius(temp_min) {
  return Math.round(temp_min - 273.15).toFixed(1);
}

function formatMaxToCelcius(temp_max) {
  return Math.round(temp_max - 273.15).toFixed(1);
}

function convertIntoKm(visibility) {
  return visibility / 1000;
}
