'use strict';

var _ = require('lodash');
var Poll = require('./polls.model');
var User = require('../user/user.model');
var slug = require('slug');
var path = require("path");

// Get list of polls
exports.find = function(req, res) {
  search(req, res, req.query)
};

function search(req, res, query) {
  Poll.find(query)
    .where('deleted').exists(false)
    .populate('userId')
    .exec(function (err, polls) {
      if(err) { return handleError(res, err); }
      
      // We don't want to return the full user record, limit to userId and userName!
      var polls = polls.map(function (p) {
        return {
          _id: p._id,
          created: p.created,
          name: p.name,
          url: p.url,
          userId: p.userId._id,
          userName: p.userId.name,
          options: p.options,
        };
      });
      return res.status(200).json(polls);
    });
}

// Creates a new poll in the DB.
exports.create = function(req, res) {
  var poll = req.body;
  poll.userId = req.user._id;
  poll.options = poll.options.map(function (option) {
    return { value: option, votes: [] };
  });
  // Urls should not change after creation
  poll.url = ('/' + slug(req.user.name) + '/' + slug(poll.name)).toLowerCase();
  
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

// Vote
exports.vote = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if (err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    // Make sure the user has not voted yet
    var hasVoted = poll.options.reduce(function (hasVoted, option) {
      if (hasVoted) return true;
      return option.votes.some(function (vote) {
        return req.user._id.equals(vote.userId);
      });
    }, false);
    if (hasVoted) {
      return res.status(403).send('Users may only vote once');
    }
    // Add this users ids to the votes
    poll.options.forEach(function (option) {
      if (option._id.equals(req.body.optionId)) {
        option.votes.push({ userId: req.user._id, datetime: new Date() });
      }
    });
    poll.save(function (err) {
      if (err) { return handleError(res, err); }
      return search(req, res, { _id: req.params.id });
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