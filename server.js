const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const auth = require("./middleware/auth");  // Auth middleware for protected routes


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const mongoURI = "mongodb://127.0.0.1:27017/bus-routes-app";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define schema for GTFS Routes
const routeSchema = new mongoose.Schema({
  route_id: String,
  route_short_name: String,
  route_long_name: String,
  route_type: Number,
});

const Route = mongoose.model("Route", routeSchema);

// Define schema for GTFS Stops
const stopSchema = new mongoose.Schema({
  stop_id: String,
  stop_name: String,
  stop_lat: Number,
  stop_lon: Number,
});

const Stop = mongoose.model("Stop", stopSchema);

// Define schema for GTFS Trips
const tripSchema = new mongoose.Schema({
  trip_id: String,
  route_id: String,
  service_id: String,
});

const Trip = mongoose.model("Trip", tripSchema);

// Define schema for GTFS Stop Times
const stopTimeSchema = new mongoose.Schema({
  trip_id: String,
  arrival_time: String,
  departure_time: String,
  stop_id: String,
  stop_sequence: Number,
});

const StopTime = mongoose.model("StopTime", stopTimeSchema);

// Define schema for Landmarks
const landmarkSchema = new mongoose.Schema({
    lid: Number,
    landmark: String,
    latitude: Number,
    longitude: Number,
    image: String,
  });
  
  const Landmark = mongoose.model("Landmark", landmarkSchema);

// Load GTFS data into MongoDB
const loadGTFSData = async () => {
  const parseCSV = (filePath, model) => {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          model
            .insertMany(results)
            .then(() => resolve())
            .catch((err) => reject(err));
        })
        .on("error", (err) => reject(err));
    });
  };

  try {
    await parseCSV(path.join(__dirname, "data", "stops.txt"), Stop);
    await parseCSV(path.join(__dirname, "data", "routes.txt"), Route);
    await parseCSV(path.join(__dirname, "data", "trips.txt"), Trip);
    await parseCSV(path.join(__dirname, "data", "stop_times.txt"), StopTime);
    console.log("GTFS data loaded successfully");
  } catch (err) {
    console.error("Error loading GTFS data:", err);
  }
};

// Call the function to load GTFS data
loadGTFSData();

// -------------------------------------------------------

// User Registration Route
app.post("/api/register", [
  check("email", "Please provide a valid email").isEmail(),
  check("password", "Password must be 6 or more characters").isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, "jwtSecret", { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// User Login Route
app.post("/api/login", [
  check("email", "Please provide a valid email").isEmail(),
  check("password", "Password is required").exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(payload, "jwtSecret", { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Logout Route
app.post("/api/logout", auth, (req, res) => {
  // For token-based logout, just inform the client to remove the token.
  res.json({ msg: "Logged out successfully" });
});

// --------------------------------------------

// API endpoints to fetch data
app.get("/api/routes", async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/api/stops", async (req, res) => {
  try {
    const stops = await Stop.find();
    res.json(stops);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/api/trips", async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/api/stop_times", async (req, res) => {
  try {
    const stopTimes = await StopTime.find();
    res.json(stopTimes);
  } catch (err) {
    res.status(500).send(err);
  }
});

// API endpoint to get landmarks
app.get("/api/landmarks", async (req, res) => {
    try {
      const landmarks = await Landmark.find();
      res.json(landmarks);
    } catch (err) {
      res.status(500).send(err);
    }
  });

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
