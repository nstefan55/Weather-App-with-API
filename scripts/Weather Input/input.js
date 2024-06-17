// export function submitCityAndHideHeading() {
//   const weatherSubmitBtn = document.querySelector('.weather-submit-btn');

//   const headingTitle = document.querySelector('.js-weather-app-title');

//   weatherSubmitBtn.addEventListener('click', () => {
//     headingTitle.classList.add('d-none');
//   });
// }

export function hideHeadingTitle() {
  const headingTitle = document.querySelector('.js-weather-app-title');

  headingTitle.classList.add('d-none');
}

export function showHeadingTitle() {
  const headingTitle = document.querySelector('.js-weather-app-title');

  headingTitle.classList.remove('d-none');
}
