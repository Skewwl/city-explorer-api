
const axios = require('axios');

function getWeather(request, response, next) {
  const { lat, lon } = request.query;
  const weatherUrl = `https://api.weatherbit.io/v2.0/current?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;
  axios.get(weatherUrl)
    .then(res => res.data.data.map((resObj) => new Forcast(resObj)))
    .then(formattedWeatherData => response.status(200).send(formattedWeatherData))
    .catch(err => next(err));
}

class Forcast {
  constructor(obj) {
    this.date = obj.ob_time;
    this.description = `The current temp is ${obj.temp}°C, with ${obj.weather.description}.`;
  }
}

module.exports = getWeather;
