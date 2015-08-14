'use strict';

var express = require('express');
var controller = require('./polls.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/user/:id', controller.getByUserId);
router.get('/poll/:id', controller.getById);

module.exports = router;