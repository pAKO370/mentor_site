var express = require("express");
var app = express();
var stormpath = require('express-stormpath');

app.use(express.static("public"));
app.use(stormpath.init(app, { }));



app.on('stormpath.ready', function () {
  app.listen(3000, function () {
    //...
  });
});