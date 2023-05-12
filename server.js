'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
// const data = require('./data/weather.json');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

class Forcast {
  constructor(obj) {
    this.date = obj.ob_time;
    this.description = `The current temp is ${obj.temp}°C, with ${obj.weather.description}.`;
  }
}

class MovieList {
  constructor(obj) {
    this.title = obj.title;
    this.poster = `https://image.tmdb.org/t/p/w200${obj.poster_path}`;
    this.overview = obj.overview;
    this.releasedOn = obj.release_date;
  }
}

app.get('/', (request, response) => {
  response.status(200).send('default route functioning appropriately');
});

app.get('/weather', async (request, response, next) => {

  try{
    const {lat, lon} = request.query;
    const weatherUrl = `https://api.weatherbit.io/v2.0/current?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;
    const weatherResponse = await axios.get(weatherUrl);
    const formattedWeatherData = weatherResponse.data.data.map((resObj) => new Forcast(resObj));
    response.status(200).send(formattedWeatherData);
  }
  catch(error){
    next(error);
  }
});

app.get('/movies', async (request, response, next) => {
  try{
    const {city} = request.query;
    const movieDBUrl = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&api_key=${process.env.MOVIE_API_KEY}&query=${city}`;
    const movieResponse = await axios.get(movieDBUrl);
    const formattedMovieData = movieResponse.data.results.map(resObj => new MovieList(resObj));
    response.status(200).send(formattedMovieData);
  }
  catch(error){
    next(error);
  }
});

app.get('*', (request, response) => {
  response.status(404).send('Not found, please review your api pathway.');
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
