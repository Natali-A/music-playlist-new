// require express, mongoose, middleware, routes
var express = require('express');
var middleware = require('./config/middleware.js');
var routes = require('./config/routes.js');
var cors= require('cors');
var cookieParser = require('cookie-parser');


// start express
var app = express();

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());


// set middleware
middleware(app, express);

// set routes
routes(app, express);

// export app
module.exports = app;


