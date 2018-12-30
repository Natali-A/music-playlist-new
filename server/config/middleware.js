// require morgan, bodyParser
var morgan = require('morgan');
var bodyParser = require('body-parser');

// export function
module.exports = function(app, express) {

  // use morgan
  app.use(morgan('dev'));

  // use bodyParser
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  // use express.static to serve client folder
  app.use(express.static(__dirname + '/../../client'));
};

