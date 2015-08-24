'use strict';

var express = require('express');
var controller = require('./polls.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.find);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.post('/create', auth.isAuthenticated(), controller.create);
router.post('/vote/:id', auth.isAuthenticated(), controller.vote);

module.exports = router;