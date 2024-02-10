import {
  renderWeatherInputFades,
  submitCityAndHideHeading,
  hideHeadingTitle,
  showHeadingTitle,
} from './Weather Input/input.js';

import { gsapHeadingAnimation } from '../scripts/Animations/animations.js';

renderWeatherInputFades();

gsapHeadingAnimation();

setInterval(periodicallyChangeGifs, 5000);

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

    const backgroundSource = document.getElementById('background');

    backgroundSource.src = getWeatherBackground(id);

    const weatherHtml = `
    <div class="weather-card container-grid">
      <div class="city-container">
        <h1 class="cityDisplay">${city}</h1>
        <p class="weatherIcon">${getWeatherEmoji(id)}</p>
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
          <h1 class="windDisplay">Wind <i class="fa-solid fa-wind m-l-1"></i></h1>
        </div>
        <div class="second-grid-container">
          <p class="wind-km-display">${formatWindSpeed(speed)} m/s</p>
          <p class="wind-deg-display"><i class="fa-solid fa-compass compass-icon"></i> ${formatWindDegToDirections(
            deg
          )}</p>
        </div>
      </div>

      <div class="weather-card card-40-percent">
        <div class="feelsLike-container">
          <h1 class="windDisplay">Feels Like <i class="fa-solid fa-temperature-high temp-high-emoji m-l-1"></i></h1>
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
          <p class="sunsetTime">${formatSunset(
            sunset
          )} <i class="fa-solid fa-moon"></i></p>
        </div>
      </div>

      <div class="weather-card weather-card-longer card-40-percent">
        <div class="sunrise-container">
          <h1 class="sunriseDisplay">Sunrise</h1>
        </div>
        <div class="flex-column">
          <p class="sunsetTime">${formatSunrise(
            sunrise
          )} <i class="fa-regular fa-sun"></i></p>
        </div>
      </div>

    </div>

    <br /><br />

    `;
    weatherContent.innerHTML = weatherHtml;

    const errorContainer = document.querySelector('.errorContainer');

    errorContainer.innerHTML = '';

    errorContainer.classList.remove('messageDisplay');
  }
}
function getWeatherBackground(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300: //id : thunderstorm
      return './video-backgrounds/thunderstorm.mp4';

    case weatherId >= 400 && weatherId < 400: //id : Rain/Drizzle Rain
      return './video-backgrounds/drizzle-rain.mp4';

    case weatherId >= 500 && weatherId < 600: //id : Heavy Rain
      return './video-backgrounds/heavy-rain.mp4';

    case weatherId >= 600 && weatherId < 700: //id : Snow
      return './video-backgrounds/snow.mp4';

    case weatherId >= 700 && weatherId < 800: //id : Atmosphere
      return './video-backgrounds/atmosphere.mp4';

    case weatherId === 800: //id : Clear
      return './video-backgrounds/clear-sky.mp4';

    case weatherId >= 801 && weatherId < 810: //id : Cloud
      return './video-backgrounds/dark-cloud.mp4';

    default:
      return './video-backgrounds/clear-sky.mp4';
  }
}

function periodicallyChangeGifs() {
  const gifURLs = [
    '../../gifs/giphy-2.gif',
    '../../gifs/giphy-4.gif',
    '../../gifs/giphy.gif',
    '../../gifs/giphy-5.gif',
    '../../gifs/giphy-3.gif',
    '../../gifs/giphy-7.gif',
    '../../gifs/giphy-6.gif',
    '../../gifs/giphy-8.gif',
  ];

  const imgElement = document.querySelector('.gif');

  const randomIndex = Math.floor(Math.random() * gifURLs.length);

  imgElement.src = gifURLs[randomIndex];
}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300: //id : thunderstorm
      return '<i class="fa-solid fa-cloud-bolt thunderstorm-emoji"></i>';

    case weatherId >= 400 && weatherId < 400: //id : Rain/Drizzle Rain
      return '<i class="fa-solid fa-cloud-rain cloud-rain-emoji"></i>';

    case weatherId >= 500 && weatherId < 600: //id : Heavy Rain
      return '<i class="fa-solid fa-cloud-showers-heavy cloud-showers-heavy-emoji"></i>';

    case weatherId >= 600 && weatherId < 700: //id : Snow
      return '<i class="fa-regular fa-snowflake snowflake-emoji"></i>';

    case weatherId >= 700 && weatherId < 800: //id : Atmosphere
      return '<i class="fa-solid fa-smog smog-emoji"></i>';

    case weatherId === 800: //id : Clear
      return '<i class="fa-solid fa-sun sun-emoji"></i>';

    case weatherId >= 801 && weatherId < 810: //id : Cloud
      return '<i class="fa-solid fa-cloud cloud-emoji"></i>';

    default:
      return '';
  }
}
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

function formatWindDegToDirections(deg) {
  let directions = [
    'North',
    'North-East',
    'East',
    'South-East',
    'South',
    'South-West',
    'West',
    'North-West',
  ];

  deg += 22.5;

  if (deg < 0) deg = 360 - (Math.abs(deg) % 360);
  else deg = deg % 360;

  let which = parseInt(deg / 45);
  return directions[which];
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
