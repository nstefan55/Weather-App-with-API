import {
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

gsapHeadingAnimation();

submitCityAndHideHeading();

const weatherForm = document.getElementById('weather-form');

const cityInput = document.querySelector('.js-weather-city-input');

const backgroundSource = document.getElementById('background-video');

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
      displayError('City not found. Please enter a City!');
      backgroundSource.src = '';
    }
  } else {
    displayError('Please enter a City!');
    document.querySelector('.js-error-container').classList.remove('d-none');
    backgroundSource.src = '';
  }
});

async function getWeatherData(city) {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  await fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeatherInfo(data);
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

    const weatherHtmlTeamplate = `
    
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="card bg-dark p-5 h-100">
              <div class="card-body text-light">
                <div
                  class="d-flex align-items-center justify-content-center rounded mx-auto"
                >
                  <h1 class="display-3 p-3 mb-3 fw-bold text-nowrap">${city}</h1>
                  <p class="display-4 p-3 fw-bold">${getWeatherEmoji(id)}</p>
                </div>
                <p class="display-4 fw-bold bg-info text-shadow rounded text-center">${formatToCelcius(
                  temp
                )} °C</p>
                <div
                  class="display-4 p-3 d-flex align-items-center text-shadow-2x justify-content-around bg-info shadow-lg rounded text-center"
                >
                  <p class="h3 fw-bold">Humidity:</p>
                  <p class="h1 fw-bold">${humidity}%</p>
                </div>
                <p class="my-4 text-center border border-info px-1 py-4 rounded h3 text-capitalize">${description}</p>
                <p class="text-center h3 mb-5 mt-5 border-info border-start">
                  Highest Temp:
                  <span class="ms-4 fw-bold">${formatMaxToCelcius(
                    temp_max
                  )} °C</span>
                </p>
                <p class="text-center h3 border-info border-end">
                  Lowest Temp:
                  <span class="ms-4 fw-bold">${formatMinToCelcius(
                    temp_min
                  )} °C</span>
                </p>
              </div>
            </div>
          </div>
          <div class="col g-5 g-md-0">
            <div class="card p-4 bg-dark">
              <div class="card-body text-light text-center">
                <h1 class="fw-bold h1 mb-5">Wind <i class="fa-solid fa-wind ms-3"></i></h1>
                <p class="mb-5 p-3 display-6 fw-bold bg-info text-shadow rounded text-center">${formatWindSpeed(
                  speed
                )} km/h</p>
                <p class="display-6 p-3 fw-bold bg-info text-shadow rounded text-center">
                  <i class="fa-solid fa-compass compass-icon"></i>
                  ${formatWindDegToDirections(deg)}
                </p>
              </div>
            </div>
            <div class="card mt-3 p-5 bg-dark">
              <div class="card-body text-light text-center">
                <h1 class="fw-bold mb-4">
                  Feels Like
                  <i class="fa-solid fa-temperature-high ms-3"></i>
                </h1>
                <p class="display-6 p-3 fw-bold bg-info text-shadow rounded text-center">${formatFeelsTemp(
                  feels_like
                )} °C</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-5">
          <div class="col gy-3 gy-md-0">
            <div class="card p-4 bg-info">
              <div class="card-body text-light text-center">
                <h1 class="text-dark fw-bold h1 mb-4 text-shadow-white-2x">Pressure</h1>
                <p class="display-6 p-3 fw-bold bg-dark text-shadow rounded text-center">${pressure} hPa</p>
              </div>
            </div>
          </div>
          <div class="col gy-3 gy-md-0">
            <div class="card p-4 bg-info">
              <div class="card-body text-light text-center">
                <h1 class="text-dark fw-bold h1 mb-4 text-shadow-white-2x">Visibility</h1>
                <p class="display-6 p-3 fw-bold bg-dark text-shadow rounded text-center">${convertIntoKm(
                  visibility
                )} km</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col gy-3 gy-md-0">
            <div class="card p-4 bg-info">
              <div class="card-body text-light text-center">
                <h1 class="text-dark fw-bold h1 mb-4 text-shadow-white-2x">Sunset <i class="fa-solid fa-moon"></i></h1>
                <p class="display-6 p-3 fw-bold bg-dark text-shadow rounded text-center">${formatSunset(
                  sunset
                )}</p>
              </div>
            </div>
          </div>
          <div class="col gy-3 gy-md-0">
            <div class="card p-4 bg-info">
              <div class="card-body text-light text-center">
                <h1 class="text-dark fw-bold h1 mb-4 text-shadow-white-2x">Sunrise <i class="fa-regular fa-sun"></i></h1>
                <p class="display-6 p-3 fw-bold bg-dark text-shadow rounded text-center">${formatSunrise(
                  sunrise
                )}</p>
              </div>
            </div>
          </div>
        </div>
    </div><br><br><br>
                

`;
    weatherContent.innerHTML = weatherHtmlTeamplate;

    const errorMessage = document.querySelector('.js-error-container');

    errorMessage.innerHTML = '';
  }
}

function getWeatherBackground(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 203: //id : thunderstorm Rain
      return './video-backgrounds/thunderstorm-rain.mp4';

    case weatherId >= 203 && weatherId < 300: //id : thunderstorm
      return './video-backgrounds/thunderstorm.mp4';

    case weatherId >= 301 && weatherId < 400: //id : Rain/Drizzle Rain
      return './video-backgrounds/drizzle-rain.mp4';

    case weatherId >= 500 && weatherId < 600: //id : Heavy Rain
      return './video-backgrounds/heavy-rain.mp4';

    case weatherId >= 600 && weatherId < 700: //id : Snow
      return './video-backgrounds/snow.mp4';

    case weatherId === 701: // ID : Mist
      return './video-backgrounds/mist.mp4';

    case weatherId === 711: // ID : Smoke
      return './video-backgrounds/smoke.mp4';

    case weatherId === 731: // ID : Sand/Dust Whirls
      return './video-backgrounds/dust.mp4';

    case weatherId === 741: // ID : Fog
      return './video-backgrounds/fog.mp4';

    case weatherId === 751: // ID : Sand
      return './video-backgrounds/dust.mp4';

    case weatherId === 761: // ID : Dust
      return './video-backgrounds/dust.mp4';

    case weatherId === 781: // ID : Tornado
      return './video-backgrounds/tornado.mp4';

    case weatherId > 702 && weatherId < 800: //id : Atmosphere
      return './video-backgrounds/atmosphere.mp4';

    case weatherId === 800: //id : Clear
      return './video-backgrounds/clear-sky.mp4';

    case weatherId >= 801 && weatherId < 810: //id : Cloud
      return './video-backgrounds/clouds.mp4';

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

  const errorMessage = document.querySelector('.js-error-container');

  errorMessage.innerHTML = message;

  timeoutId = setTimeout(() => {
    document.querySelector('.js-error-container').classList.add('d-none');

    showHeadingTitle();
  }, 8000);
}
