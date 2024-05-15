export function formatToCelcius(temp) {
  const formattedTemp = Math.round(((temp - 32) * 5) / 9).toFixed(1);
  return formattedTemp.endsWith('.0')
    ? formattedTemp.slice(0, -2)
    : formattedTemp;
}

export function formatFeelsTemp(feels_like) {
  const formattedFeelsTemp = Math.round(((feels_like - 32) * 5) / 9).toFixed(1);
  return formattedFeelsTemp.endsWith('.0')
    ? formattedFeelsTemp.slice(0, -2)
    : formattedFeelsTemp;
}

export function formatMinToCelcius(temp_min) {
  const formattedMinToCelcius = Math.round(((temp_min - 32) * 5) / 9).toFixed(
    1
  );
  return formattedMinToCelcius.endsWith('.0')
    ? formattedMinToCelcius.slice(0, -2)
    : formattedMinToCelcius;
}

export function formatMaxToCelcius(temp_max) {
  const formattedMaxToCelcius = Math.round(((temp_max - 32) * 5) / 9).toFixed(
    1
  );
  return formattedMaxToCelcius.endsWith('.0')
    ? formattedMaxToCelcius.slice(0, -2)
    : formattedMaxToCelcius;
}

export function formatWindSpeed(speed) {
  const formattedSpeed = (speed * 1.609344).toFixed(1);
  return formattedSpeed.endsWith('.0')
    ? formattedSpeed.slice(0, -2)
    : formattedSpeed;
}

export function formatWindDegToDirections(deg) {
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

export function convertIntoKm(visibility) {
  return visibility / 1000;
}

export function formatSunset(sunset) {
  let unix_sunset = sunset;

  let sunsetDate = new Date(unix_sunset * 1000);

  let sunsetHours = sunsetDate.getHours();

  let sunsetMinutes = '0' + sunsetDate.getMinutes();

  let formattedSunset = sunsetHours + ':' + sunsetMinutes.substr(-2);

  return formattedSunset;
}

export function formatSunrise(sunrise) {
  let unix_sunrise = sunrise;

  let sunriseDate = new Date(unix_sunrise * 1000);

  let sunriseHours = sunriseDate.getHours();

  let sunriseMinutes = '0' + sunriseDate.getMinutes();

  let formattedSunrise = sunriseHours + ':' + sunriseMinutes.substr(-2);

  return formattedSunrise;
}

export function checkCityZagreb(cityInput, city) {
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
