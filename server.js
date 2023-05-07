'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const data = require('./data/weather.json');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

app.get('/', (request, response) => {
  response.status(200).send('default route functioning appropriately');
});

app.get('/weather', (request, response) => {
  response.status(200).send(data);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
