'use strict';

var mongoose = require('mongoose'),
    User = require('../user/user.model'),
    Schema = mongoose.Schema;

var userId = { type: Schema.Types.ObjectId, ref: 'User' };
var PollSchema = new Schema({
  userId: userId,
  name: String,
  url: { type: String, unique: true },
  options: [{
    value: String,
    votes: [{
      userId: userId,
      datetime: Date
      
    }],
  }],
  created: Date,
  updated: Date,
  deleted: Date,
});

PollSchema.pre('save', function (next) {
  updateTimestamps(this);
  next();
});

function updateTimestamps(poll) {
  var now = new Date();
  if ( !poll.created ) poll.created = now;
  poll.updated = now;
}

module.exports = mongoose.model('Poll', PollSchema);