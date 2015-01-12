var day = require('../lib/day-like-today');

day('http://www.tuhistory.com/hoy-en-la-historia/2014-12-25', function(parsedResults) {
    console.log(parsedResults);
});