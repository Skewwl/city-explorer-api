
const axios = require('axios');
const cache = require('./cache');

function getWeather(request, response, next) {
  const { lat, lon } = request.query;
  const weatherUrl = `https://api.weatherbit.io/v2.0/current?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;
  const key = lat + lon;

  if (cache[key] && Date.now() - cache[key].timestamp < 1800000) {
    console.log('cache hit- getting data from cache');
    response.status(200).send(cache[key].data);
  } else {
    console.log('cache miss- getting data from api');
    axios.get(weatherUrl)
      .then(res => res.data.data.map((resObj) => new Forcast(resObj)))
      .then(formattedWeatherData => {
        cache[key] = {};
        cache[key].data = formattedWeatherData;
        cache[key].timestamp = Date.now();
        response.status(200).send(formattedWeatherData);
      })
      .catch(err => next(err));
  }
}

class Forcast {
  constructor(obj) {
    this.date = obj.ob_time;
    this.description = `The current temp is ${obj.temp}°C, with ${obj.weather.description}.`;
  }
}

module.exports = getWeather;
