// models/Stop.js

const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    stop_id: String,
    stop_name: String,
    stop_lat: Number,
    stop_lon: Number
});

const Stop = mongoose.model('Stop', stopSchema);

module.exports = Stop;
