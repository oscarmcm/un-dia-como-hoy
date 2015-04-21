var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
require('date-utils');
var app     = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

var url ='http://www.tuhistory.com/hoy-en-la-historia/';

var currentDate = Date.today();

function MakeScrap(buildApi){
  return function(error, resp, html) {  
    if (!error) {
      var results = []
      var $ = cheerio.load(html);
      var image, title, date, summary, id
      $('div.contenido').each(function(i, element) {
        var data = $(this);
        image = data.find('.left-column').find('.content-image')
        .children('img').attr('src');
        title = data.find('.right-column').find('h4').text();
        date = data.find('.right-column').find('h6').text();
        summary = data.find('.content-text-large').children('p').text();
        id = i+1;

        var metadata = {
          id: parseInt(id),
          title: title,
          date: date,
          summary: summary,
          image: image,
        }
        results.push(metadata);
      })
      console.log('Make the things happens');
      buildApi(results);
    }
    else {
      console.log('Ummm, something is broken!');
    }
  }
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res, next){
  now = currentDate.toYMD('-')
  request(url + now, MakeScrap(function(results) {
    res.json(results);
  }));
})

app.get('/:date', function(req, res, next){
  now = req.params.id
  request(url + now, MakeScrap(function(results) {
    res.json(results);
  }));
})

app.listen(port)
console.log('Magic happens on port ' + port);
exports = module.exports = app;
