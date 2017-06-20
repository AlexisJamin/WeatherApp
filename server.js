var express = require('express');
var request = require('request');
var mongoose= require('mongoose');

var options = { server: { socketOptions: {connectTimeoutMS: 30000 } }};

mongoose.connect('mongodb://Alexis:RakvJtsO01@ds055762.mlab.com:55762/weather_app', options, function(err) {

});

var citySchema = mongoose.Schema({
    name: String,
    icon: String,
    description: String,
    temp_max: String,
    temp_min : String,
    lon : String,
    lat : String,
    sort : Number
});

var cityModel = mongoose.model('City', citySchema);

var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

var cityList=[];

app.get('/', function (req, res) {
  cityModel.find( null, null, {sort : {sort : 1}}, function (err, cities) {
  cityList = cities;
  console.log(cityList);
  res.render('index', {cityList : cityList});
});
});


app.get('/add', function (req, res) {
console.log(cityList.length);
  request("http://api.openweathermap.org/data/2.5/weather?q="+req.query.city+"&APPID=9b754f1f40051783e4f72c176953866e&units=metric&lang=fr", function(error, response, body) {
  body = JSON.parse(body);
  //cityList.push(body);

  if (cityList.length===0) {
    var sort = 1;
  }
  else
  {
    var sort = cityList[cityList.length-1].sort+1;
  }

  var city = new cityModel ({
   name: body.name,
   icon: body.weather[0].icon,
   description: body.weather[0].description,
   temp_max: body.main.temp_max,
   temp_min : body.main.temp_min,
   lon : body.coord.lon,
   lat : body.coord.lat,
   sort : sort
    });

      city.save(function (error, city) {
        cityModel.find(null, null, {sort : {sort : 1}},function (err, cities) {
          cityList = cities;
          res.render('index', {cityList : cityList});
        });
      });
    });  
});

app.get('/delete', function (req, res) {
  //cityList.splice(req.query.position, 1);
  
cityModel.remove({ _id: req.query.id }, function(error) {
  cityModel.find(null, null, {sort : {sort : 1}},function (err, cities) {
  cityList = cities;
  res.render('index', {cityList : cityList});
  });
});
});

app.get('/update', function (req, res) {
  
  var newList = JSON.parse(req.query.newList);
  console.log(JSON.parse(req.query.newList));
  var newCityList=[];
  for (var i = 0; i < newList.length; i++) {
    newCityList.push(cityList[newList[i]]);

cityModel.update({ _id: newCityList[i]._id}, { sort : i }, function(error, raw) {
});
  
  }
  cityList=newCityList;
  console.log(cityList);

  res.render('index', {cityList : cityList});
       

});
  

app.listen(8080, function () {
  console.log("Server listening on port 80");
});
