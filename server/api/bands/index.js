'use strict';

var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('lodash');
var path = require("path");
var Promise = require('bluebird');

var bandCache = null;

// Get ?count=x number of random band names or default = 10
router.get('/', function (req, res) {
  var count = req.query.count ? Number(req.query.count) : 10;
  
  new Promise(function (resolve) {
    if (bandCache) return resolve();
    fs.readFile(path.join(__dirname, 'bands.json'), function (err, data) {
      bandCache = JSON.parse(data);
      resolve();
    });
  }).then(function () {
    res.json(_.sample(bandCache, count));
  });
});

module.exports = router;
