'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;
const getWeather = require('./modules/getWeather');
const getMovies = require('./modules/getMovies');

app.get('/', (request, response) => {
  response.status(200).send('default route functioning appropriately');
});

app.get('/weather', getWeather);

app.get('/movies', getMovies);

app.get('*', (request, response) => {
  response.status(404).send('Not found, please review your api pathway.');
});

app.use((error, request, response) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
