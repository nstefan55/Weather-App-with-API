export function renderWeatherInputFades() {
  const weatherCityInput = document.querySelector('.js-weather-city-input');

  weatherCityInput.addEventListener('focus', () => {
    weatherCityInput.classList.add('placeholder-fadeOut');
    weatherCityInput.classList.remove('placeholder-fadeIn');
  });

  weatherCityInput.addEventListener('blur', () => {
    weatherCityInput.classList.remove('placeholder-fadeOut');
    weatherCityInput.classList.add('placeholder-fadeIn');
  });
}

export function submitCityAndHideHeading() {
  const weatherSubmitBtn = document.querySelector('.weather-submit-btn');

  const headingTitle = document.querySelector('.js-weather-app-title');

  weatherSubmitBtn.addEventListener('click', () => {
    headingTitle.classList.add('displayNone');
  });
}

export function hideHeadingTitle() {
  const headingTitle = document.querySelector('.js-weather-app-title');

  headingTitle.classList.add('displayNone');
}

export function showHeadingTitle() {
  const headingTitle = document.querySelector('.js-weather-app-title');

  headingTitle.classList.remove('displayNone');
}
