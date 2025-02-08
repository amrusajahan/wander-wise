// models/Route.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RouteSchema = new Schema({
  start: String,
  end: String,
  waypoints: Array
});

module.exports = mongoose.model('Route', RouteSchema);
