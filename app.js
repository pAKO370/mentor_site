var express = require("express");
var port = Number(process.env.PORT || 3000);

var app = express();

app.use(express.static("public"));
//app.use('/topics', express.static('public'));

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('public' + '/index.html', { root: __dirname });
});

  app.listen(port, function () {
    //...
  });