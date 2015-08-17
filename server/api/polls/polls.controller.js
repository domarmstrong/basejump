'use strict';

var _ = require('lodash');
var Poll = require('./polls.model');
var slug = require('slug');
var path = require("path");

// Get list of things
exports.find = function(req, res) {
  Poll.find(req.query).where('deleted').exists(false).exec(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(things);
  });
};

// Creates a new poll in the DB.
exports.create = function(req, res) {
  var poll = req.body;
  poll.userId = req.user._id;
  poll.options = poll.options.map(function (option) {
    return { value: option, votes: [] };
  });
  // Urls should not change after creation
  poll.url = path.join(slug(req.user.name), slug(poll.name)).toLowerCase();
  
  Poll.create(req.body, function(err, poll) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(poll);
  });
};

// Updates an existing poll in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Poll.findById(req.params.id, function (err, poll) {
    if (err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    if (! poll.userId.equals(req.user._id)) {
      return res.status(403).send('Users may only update thier own polls');
    }
    var updated = _.merge(poll, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(poll);
    });
  });
};

// Deletes a poll from the DB.
exports.destroy = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    if (! poll.userId.equals(req.user._id)) {
      return res.status(403).send('Users may only delete thier own polls');
    }
    poll.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}