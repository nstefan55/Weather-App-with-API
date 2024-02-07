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
  //console.log(data);

  hideHeadingTitle();

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

    city = checkCityZagreb(cityInput, city);

    const weatherHtml = `
    <div class="weather-card container-grid">
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
          <p class="wind-km-display">${formatWindSpeed(speed)} m/s</p>
          <p class="wind-deg-display">${formatWindDeg(deg)} deg</p>
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
          <p class="sunsetTime">${formatSunset(sunset)}</p>
        </div>
      </div>

      <div class="weather-card weather-card-longer card-40-percent">
        <div class="sunrise-container">
          <h1 class="sunriseDisplay">Sunrise</h1>
        </div>
        <div class="flex-column">
          <p class="sunsetTime">${formatSunrise(sunrise)}</p>
        </div>
      </div>

    </div>

    <br /><br />

    <div class="weather-card flex-center"> 
      <button type="submit" class="weather-submit-btn get-forecast-btn" id="forecastButton">Get Forecast Weather</button>
    </div>
    
  
    `;
    weatherContent.innerHTML = weatherHtml;
    sdasdasdas;

    const errorContainer = document.querySelector('.errorContainer');

    errorContainer.innerHTML = '';

    errorContainer.classList.remove('messageDisplay');

    //Forecast Weather Section

    const forecastContent = document.getElementById('forecastButton');

    forecastContent.addEventListener('submit', async (event) => {
      event.preventDefault();
    });
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
  }, 7000);
}

function formatToCelcius(temp) {
  const formattedTemp = Math.round(temp - 273.15).toFixed(1);
  return formattedTemp.endsWith('.0')
    ? formattedTemp.slice(0, -2)
    : formattedTemp;
}

function formatFeelsTemp(feels_like) {
  const formattedFeelsTemp = Math.round(feels_like - 273.15).toFixed(1);
  return formattedFeelsTemp.endsWith('.0')
    ? formattedFeelsTemp.slice(0, -2)
    : formattedFeelsTemp;
}

function formatMinToCelcius(temp_min) {
  const formattedMinToCelcius = Math.round(temp_min - 273.15).toFixed(1);
  return formattedMinToCelcius.endsWith('.0')
    ? formattedMinToCelcius.slice(0, -2)
    : formattedMinToCelcius;
}

function formatMaxToCelcius(temp_max) {
  const formattedMaxToCelcius = Math.round(temp_max - 273.15).toFixed(1);
  return formattedMaxToCelcius.endsWith('.0')
    ? formattedMaxToCelcius.slice(0, -2)
    : formattedMaxToCelcius;
}

function formatWindSpeed(speed) {
  const formattedSpeed = speed.toFixed(1);
  return formattedSpeed.endsWith('.0')
    ? formattedSpeed.slice(0, -2)
    : formattedSpeed;
}

function formatWindDeg(deg) {
  const formattedDeg = deg.toFixed(1);
  return formattedDeg.endsWith('.0') ? formattedDeg.slice(0, -2) : formattedDeg;
}

function convertIntoKm(visibility) {
  return visibility / 1000;
}

function formatSunset(sunset) {
  let unix_sunset = sunset;

  let sunsetDate = new Date(unix_sunset * 1000);

  let sunsetHours = sunsetDate.getHours();

  let sunsetMinutes = '0' + sunsetDate.getMinutes();

  let formattedSunset = sunsetHours + ':' + sunsetMinutes.substr(-2);

  return formattedSunset;
}

function formatSunrise(sunrise) {
  let unix_sunrise = sunrise;

  let sunriseDate = new Date(unix_sunrise * 1000);

  let sunriseHours = sunriseDate.getHours();

  let sunriseMinutes = '0' + sunriseDate.getMinutes();

  let formattedSunrise = sunriseHours + ':' + sunriseMinutes.substr(-2);

  return formattedSunrise;
}

function checkCityZagreb(cityInput, city) {
  if (
    cityInput.value === 'zagreb' ||
    cityInput.value === 'Zagreb' ||
    cityInput.value === 'Grad Zagreb' ||
    cityInput.value === 'grad zagreb'
  ) {
    return 'Zagreb';
  }

  return city;
}
