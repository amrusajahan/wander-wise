// models/Trip.js

const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    route_id: String,
    service_id: String,
    trip_id: String,
    trip_headsign: String,
    direction_id: Number,
    block_id: String,
    shape_id: String
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
