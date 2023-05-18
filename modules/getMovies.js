
const axios = require('axios');
const cache = require('./cache');

function getMovies(request, response, next){
  const {city} = request.query;
  const movieDBUrl = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&api_key=${process.env.MOVIE_API_KEY}&query=${city}`;
  const key = city;

  if (cache[key] && Date.now() - cache[key].timestamp < 86400000) {
    console.log('cache hit- sending data from cache');
    response.status(200).send(cache[key].data);
  } else {
    console.log('cache miss- making request to api');
    axios.get(movieDBUrl)
      .then(res => res.data.results.map(resObj => new MovieList(resObj)))
      .then(formattedMovieData => {
        cache[key] = {};
        cache[key].data = formattedMovieData;
        cache[key].timestamp = Date.now();
        response.status(200).send(formattedMovieData);
      })
      .catch(err => next(err));
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

module.exports = getMovies;
