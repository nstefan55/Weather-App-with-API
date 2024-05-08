import {
  renderWeatherInputFades,
  submitCityAndHideHeading,
  hideHeadingTitle,
  showHeadingTitle,
} from './Weather Input/input.js';

import {
  formatFeelsTemp,
  formatToCelcius,
  formatMaxToCelcius,
  formatMinToCelcius,
  formatWindDegToDirections,
  formatWindSpeed,
  convertIntoKm,
  formatSunrise,
  formatSunset,
  checkCityZagreb,
} from './Formatting/format.js';

import { gsapHeadingAnimation } from '../scripts/Animations/animations.js';

import WEATHER_API_KEY from './apiKey.js';

renderWeatherInputFades();

gsapHeadingAnimation();

submitCityAndHideHeading();

const weatherForm = document.getElementById('weather-form');

const cityInput = document.querySelector('.js-weather-city-input');

const backgroundSource = document.getElementById('background');

const apiKey = WEATHER_API_KEY;

let timeoutId;

//if user has disabled animations - show full heading
const hiddenHeading = document.getElementById('hidden-heading');
if (window.matchMedia('(prefers-reduced-motion: reduce').matches) {
  hiddenHeading.classList.remove('hidden');
}

weatherForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const city = cityInput.value;

  clearTimeout(timeoutId);

  if (city) {
    try {
      const weatherData = await getWeatherData(city);

      displayCurrentWeatherInfo(weatherData);
    } catch (error) {
      console.log(error);
      displayError(error);
      backgroundSource.src = '';
    }
  } else {
    displayError('Please Enter a City!');
    document.querySelector('.errorContainer').classList.remove('displayNone');
    backgroundSource.src = '';
  }
});

async function getWeatherData(city) {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  await fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeatherInfo(data);
    })
    .catch((error) => {
      console.log('Error fetching current weather data:', error);
    });
}

function displayCurrentWeatherInfo(data) {
  console.log(data);

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

    backgroundSource.src = getWeatherBackground(id);

    const weatherHtml = `

        <div class="container">
          <div class="row">
            <div class="col">
              <div class="card weather-card-bg p-4 h-100">
                <div class="card-body text-light">
                  <div class="d-flex align-items-center justify-content-center rounded mx-auto">
                    <h1 class="cityDisplay p-3 mb-3">${city}</h1>
                    <p class="weatherIcon p-3">${getWeatherEmoji(id)}</p>
                  </div>
                  <p class="tempDisplay details-bg">${formatToCelcius(
                    temp
                  )} °C</p>
                  <div class="d-flex align-items-center text-center justify-content-around details-bg mt-5">
                    <p class="humidityDisplay m-0 h3">Humidity:</p>
                    <p class="humidityPercentDisplay m-0">${humidity}%</p>
                  </div>
                  <p class="descDisplay my-4">${description}</p>
                  <p class="high-tempDisplay text-center">
                    High Temp: <span class="ms-4">${formatMaxToCelcius(
                      temp_max
                    )} °C</span>
                  </p>
                  <p class="low-tempDisplay text-center">Low Temp: <span class="ms-4">${formatMinToCelcius(
                    temp_min
                  )} °C</span>
                </div>
              </div>
            </div>
            <div class="col"> 
              <div class="card p-4 weather-card-bg">
                <div class="card-body text-light text-center">
                  <h1 class="windDisplay">
                    Wind <i class="fa-solid fa-wind m-l-1"></i>
                  </h1>
                  <p class="wind-km-display">${formatWindSpeed(speed)} m/s</p>
                  <p class="wind-deg-display">
                    <i class="fa-solid fa-compass compass-icon"></i>
                    ${formatWindDegToDirections(deg)}
                  </p>
                </div>
              </div>
              <div class="card mt-5 p-5 weather-card-bg">
                <div class="card-body text-light">
                  <h1 class="windDisplay">
                    Feels Like
                    <i class="fa-solid fa-temperature-high temp-high-emoji m-l-1"></i>
                  </h1>
                  <p class="feels-like-display">${formatFeelsTemp(
                    feels_like
                  )} °C</p>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-5">
            <div class="col">
              <div class="card p-4 weather-card-bg">
                <div class="card-body text-light">
                  <h1 class="pressureDisplay">Pressure</h1>
                  <p class="pressure-parameter">${pressure} hPa</p>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card p-4 weather-card-bg">
                <div class="card-body text-light">
                  <h1 class="visibilityDisplay">Visibility</h1>
                  <p class="distanceParameterDisplay">
                    ${convertIntoKm(visibility)} km
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col">
              <div class="card p-4 weather-card-bg">
                <div class="card-body text-light">
                  <h1 class="sunsetDisplay">Sunset</h1>
                  <p class="sunsetTime">
                    ${formatSunset(sunset)} <i class="fa-solid fa-moon"></i>
                  </p>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card p-4 weather-card-bg">
                <div class="card-body text-light">
                  <h1 class="sunriseDisplay">Sunrise</h1>
                  <p class="sunsetTime">
                    ${formatSunrise(sunrise)} <i class="fa-regular fa-sun"></i>
                  </p>
                </div>
              </div>
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
  }, 8000);
}
