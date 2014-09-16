var http = require("http");
var request = require('request');
var cheerio = require('cheerio');
var Percolator = require('percolator').Percolator;
var server = new Percolator();

var url = "http://tuhistory.com/hoy-en-la-historia/";
var date = new Date();
var year = date.getFullYear();
var currentMonth = ('0'+(date.getMonth()+1)).slice(-2);
var currentDay = date.getDate();
if (currentDay < 10) { currentDay = '0' + currentMonth; }
var fdate = year.toString()+'-'+currentMonth.toString()+'-'+currentDay.toString();

console.log("Scraping To:"+url+fdate);

request(url+fdate, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    var parsedResults = [];
    $('div.contenido').each(function(i, element){
      var a = $(this);
      var image = a.find('.left-column').find('.content-image').children('img').attr('src');
      var title = a.find('.right-column').find('h4').text();
      var date = a.find('.right-column').find('h6').text();
      var summary = a.find('.content-text-large').children('p').text();
      var id = i++;
      //parsed meta data object
      var metadata = {
        title: title,
        date: date,
        summary: summary,
        image: image,
        id: parseInt(id)
      };
      // Push meta-data into parsedResults array
      parsedResults.push(metadata);
    });
    // Log our finished parse results in the terminal
    server.route('/', function(req, res){
        res.object({Results : parsedResults})
             .send();
          });

  }
});

server.listen(function(err){
    if (err) { throw err; }
    console.log("The Api Is Running On ", server.port);
});
