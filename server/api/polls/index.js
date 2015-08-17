'use strict';

var express = require('express');
var controller = require('./polls.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/user/:id', controller.getByUserId);
router.get('/poll/:id', controller.getById);
router.post('/create', auth.isAuthenticated(), controller.create);

module.exports = router;