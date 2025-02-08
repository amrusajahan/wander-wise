// routes/api.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOOGLE_MAPS_API_KEY = 'AIzaSyCl0-QiTyl1FEFYZB_Cp4LuUKPHnnh20LA';

router.get('/route', async (req, res) => {
  try {
    const { start, end } = req.query;
    const directionsResponse = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&key=${GOOGLE_MAPS_API_KEY}`);
    const directions = directionsResponse.data.routes[0];
    const waypoints = directions.legs[0].steps.map(step => ({
      lat: step.start_location.lat,
      lng: step.start_location.lng
    }));

    const placesResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${waypoints[0].lat},${waypoints[0].lng}&radius=500&key=${GOOGLE_MAPS_API_KEY}`);
    const places = placesResponse.data.results;

    res.json({
      center: waypoints[0],
      waypoints: waypoints,
      places: places
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
