'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const data = require('./data/weather.json');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

class Forcast {
  constructor(obj) {
    this.date = obj.valid_date;
    this.description = `Low of ${obj.low_temp}, High of ${obj.high_temp}, with ${obj.weather.description}`;
  }
}

app.get('/', (request, response) => {
  response.status(200).send('default route functioning appropriately');
});

app.get('/weather', (request, response, next) => {

  try{
    const {searchQuery, lat, lon} = request.query;
    const cityData = data.find(obj => obj.city_name.toLowerCase() === searchQuery.toLowerCase());
    const formattedData = cityData.data.map(element => new Forcast(element));
    response.send(formattedData);
  }
  catch(error){
    next(error);
  }
});

app.get('*', (request, response) => {
  response.status(404).send('Not found');
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
