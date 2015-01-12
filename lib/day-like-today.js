var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var parsedResults = [];
var url ='http://www.tuhistory.com/hoy-en-la-historia/2014-12-25';
request(url , function(error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    $('div.contenido').each(function(i, element) {
      var a = $(this);
      var image = a.find('.left-column').find('.content-image')
      .children('img').attr('src');
      var title = a.find('.right-column').find('h4').text();
      var date = a.find('.right-column').find('h6').text();
      var summary = a.find('.content-text-large').children('p').text();
      var id = i+1;
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
    console.log(parsedResults);
  }
  else {
    console.log('Ummm, something is broken!');
  }
});