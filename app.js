var express = require("express");
var port = Number(process.env.PORT || 3000);

var app = express();

app.use(express.static("public"));



  app.listen(port, function () {
    //...
  });