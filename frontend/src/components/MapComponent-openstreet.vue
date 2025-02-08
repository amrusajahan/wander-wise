<template>
  <div>
    <div id="map" style="height: 500px; width: 100%;"></div>
    <br>
    <form @submit.prevent="getDirections">
      <div class="space-y-4 m-5">
        <div>
          <label class="text-base font-medium text-gray-900">Start</label>
          <div class="mt-2 flex lg:w-1/2 mx-auto">
            <input
              v-model="start"
              placeholder="Starting Point"
              type="text"
              class="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              name="starting_point"
            />

            <button
              type="button"
              @click="setCurrentLocation"
              class="group cursor-pointer outline-none ms-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2.5rem"
                height="2.5rem"
                viewBox="0 0 24 24"
                class="stroke-gray-500 fill-none group-active:stroke-gray-500 group-active:duration-0 duration-300"
              >
                <path
                  d="M21 12C21 16.9706 16.9706 21 12 21M21 12C21 7.02944 16.9706 3 12 3M21 12H17M12 21C7.02944 21 3 16.9706 3 12M12 21V17M3 12C3 7.02944 7.02944 3 12 3M3 12H7M12 3V7M12 12H12.01"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label class="text-base font-medium text-gray-900">Destination</label>
          <div class="mt-2">
            <input
              v-model="end"
              placeholder="End Point"
              type="text"
              class="flex h-10 w-full lg:w-1/2 mx-auto rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              name="ending_point"
            />
          </div>
        </div>

        <button
          class="inline-flex w-full lg:w-1/2 items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
          type="submit"
        >
          Get Directions
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import L from "leaflet";
import axios from "axios";

export default {
  data() {
    return {
      map: null,
      start: "",
      end: "",
      markers: [],
      landmarks: [],
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.map = L.map("map").setView([6.0329, 80.2168], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
    },
    setCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.start = `${position.coords.latitude},${position.coords.longitude}`;
            this.map.setView([position.coords.latitude, position.coords.longitude], 13);
          },
          (error) => {
            console.error("Error getting current location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    },
    async getDirections() {
      // Use your backend to calculate the route between start and end
      try {
        const response = await axios.get("http://localhost:3000/api/calculate-route", {
          params: { start: this.start, end: this.end },
        });
        const route = response.data.route;

        // Clear existing markers and polylines
        this.clearMap();

        // Plot route on the map
        const polyline = L.polyline(route, { color: "blue" }).addTo(this.map);
        this.map.fitBounds(polyline.getBounds());

        // Add markers for start and end
        L.marker(route[0]).addTo(this.map).bindPopup("Start");
        L.marker(route[route.length - 1]).addTo(this.map).bindPopup("End");

        // Fetch and plot landmarks near the route
        this.fetchLandmarks(route);
      } catch (error) {
        console.error("Error getting directions:", error);
      }
    },
    clearMap() {
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          this.map.removeLayer(layer);
        }
      });
    },
    async fetchLandmarks(route) {
      try {
        const response = await axios.get("http://localhost:3000/api/landmarks");
        const allLandmarks = response.data;

        // Filter landmarks that are close to the route
        this.landmarks = allLandmarks.filter((landmark) => {
          return route.some((point) => this.isPointClose(point, landmark));
        });

        // Add markers for landmarks
        this.landmarks.forEach((landmark) => {
          L.marker([landmark.latitude, landmark.longitude])
            .addTo(this.map)
            .bindPopup(landmark.landmark);
        });
      } catch (err) {
        console.error("Failed to fetch landmarks:", err);
      }
    },
    isPointClose(point, landmark) {
      const distanceThreshold = 0.01; // Approx 1 km, adjust as necessary
      const distance = Math.sqrt(
        Math.pow(point[0] - landmark.latitude, 2) + Math.pow(point[1] - landmark.longitude, 2)
      );
      return distance < distanceThreshold;
    },
  },
};
</script>

<style>
#map {
  height: 500px;
  width: 100%;
}
</style>
