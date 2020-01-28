const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
});

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.API_KEY}`;

  request(url, function (err, response, body) {
    if (err) {
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body);
      const iconUrl = "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png";
      if (weather.main === undefined) {
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        res.render('index', {
          weather: 'loading',
          iconUrl,
          description: weather.weather[0].description,
          sky: weather.weather[0].main,
          city,
          temp: weather.main.temp,
          temp_max: weather.main.temp_max,
          temp_min: weather.main.temp_min,
          wind_speed: weather.wind.speed,
          error: null
        });
      }
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Example app listening on port 3000!')
});


