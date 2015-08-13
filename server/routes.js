/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var request = require('request');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));
  
  app.get('/livereload.js', function (req, res) {
    // Proxy to the livereload server, cloud9 does not expose its port so cant use directly
    return request.get('http://0.0.0.0:35729' + req.url).pipe(res);
  });

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};