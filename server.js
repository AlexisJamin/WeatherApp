var express = require('express');
var request = require('request');

var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

var cityList = [];

app.get('/', function (req, res) {
  res.render('index', {cityList : cityList});
});

app.get('/add', function (req, res) {
    request("http://api.openweathermap.org/data/2.5/weather?q="+req.query.city+"&APPID=9b754f1f40051783e4f72c176953866e&units=metric&lang=fr", function(error, response, body) {
      body = JSON.parse(body);
      cityList.push(body);
      res.render('index', {cityList : cityList});
    });
    
});

app.get('/delete', function (req, res) {
  cityList.splice(req.query.position, 1);
  res.render('index', {cityList : cityList});
});

app.get('/update', function (req, res) {
  
  var newList = JSON.parse(req.query.newList);
  var newCityList=[];
  for (var i = 0; i < newList.length; i++) {
    newCityList.push(cityList[newList[i]]);
  }
  cityList=newCityList;

  res.render('index', {cityList : cityList});
});


app.listen(8080, function () {
  console.log("Server listening on port 80");
});