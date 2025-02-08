<template>
    <div>

        <!-- Route Options Section -->
        <!-- <div class="route-options">
            <h2>Route Options</h2>
            <ul v-if="polylinePath.length">
                <li v-for="(route, index) in polylinePath" :key="index">
                    <button @click="highlightRoute(route)">Route {{ index + 1 }}</button>
                </li>
            </ul>
            <div v-else>No routes available.</div>
        </div> -->

        <!-- Landmark Section -->
        <div class="landmark-section">
            <h2>Landmarks Along Your Route</h2>
            <div class="landmark-container">
                <div class="landmark-card" v-for="(landmark, index) in landmarks" :key="index">
                    <img v-if="landmark.image" :src="landmark.image" alt="landmark" class="landmark-image" />
                    <h3>{{ landmark.landmark }}</h3>
                </div>
            </div>
        </div>

        <!-- Journey Info (Carbon Footprint, Bus Fare) -->
        <div class="journey-info">
            <div><strong>Carbon Footprint:</strong> {{ carbonFootprint }} kg CO2</div>
            <div><strong>Bus Fare:</strong> {{ busFare }} LKR</div>
        </div>

        <br>

        <!-- Directions Form -->
        <form @submit.prevent="getDirections">
            <div class="space-y-4 m-5">
                <div>
                    <label class="text-base font-medium text-gray-900">Start</label>
                    <div class="mt-2 flex lg:w-1/2 mx-auto">
                        <input v-model="start" @input="getSuggestions('start')" placeholder="Starting Point" type="text"
                            class="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50" />
                        <ul v-if="startSuggestions.length" class="suggestions">
                            <li v-for="(suggestion, index) in startSuggestions" :key="index"
                                @click="selectSuggestion(suggestion, 'start')">
                                {{ suggestion.description }}
                            </li>
                        </ul>
                        <button type="button" @click="setCurrentLocation"
                            class="group cursor-pointer outline-none ms-2">
                            <!-- SVG Icon for Current Location -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="2.5rem" height="2.5rem" viewBox="0 0 24 24"
                                class="stroke-gray-500 fill-none">
                                <path
                                    d="M21 12C21 16.9706 16.9706 21 12 21M21 12C21 7.02944 16.9706 3 12 3M21 12H17M12 21C7.02944 21 3 16.9706 3 12M12 21V17M3 12C3 7.02944 7.02944 3 12 3M3 12H7M12 3V7M12 12H12.01"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div>
                    <label class="text-base font-medium text-gray-900">Destination</label>
                    <div class="mt-2">
                        <input v-model="end" @input="getSuggestions('end')" placeholder="End Point" type="text"
                            class="flex h-10 w-full lg:w-1/2 mx-auto rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50" />
                        <ul v-if="endSuggestions.length" class="suggestions">
                            <li v-for="(suggestion, index) in endSuggestions" :key="index"
                                @click="selectSuggestion(suggestion, 'end')">
                                {{ suggestion.description }}
                            </li>
                        </ul>
                    </div>
                </div>

                <button
                    class="inline-flex w-full lg:w-1/2 items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                    type="submit">
                    Get Directions
                </button>
            </div>
        </form>

        <!-- Google Map -->
        <GmapMap :center="center" :zoom="zoom" :style="mapStyle">
            <!-- Displaying multiple polylines for different routes -->
            <GmapPolyline v-for="(polyline, index) in polylinePath" :key="index" :path="polyline.path"
                :options="{ strokeColor: polyline.strokeColor, strokeWeight: 4 }" />

            <GmapMarker v-for="(landmark, index) in landmarks" :key="index"
                :position="{ lat: landmark.latitude, lng: landmark.longitude }" :clickable="true"
                :title="landmark.landmark" />

            <!-- Displaying markers for all routes -->
            <GmapMarker v-for="(m, index) in markers" :key="index" :position="m.position" :clickable="true" />

        </GmapMap>
    </div>
</template>

<script>
/* global google */
import axios from 'axios';
import { Map as GmapMap, Polyline as GmapPolyline, Marker as GmapMarker } from '@fawmi/vue-google-maps';

export default {
    components: {
        GmapMap,
        GmapMarker,
        GmapPolyline
    },
    data() {
        return {
            center: { lat: 6.0329, lng: 80.2168 },
            zoom: 13,
            mapStyle: "width: 100vw; height: 90vh",
            start: '',
            end: '',
            startSuggestions: [],
            endSuggestions: [],
            polylinePaths: [], // To store paths of all alternative routes
            markers: [],
            landmarks: [],
            carbonFootprint: 0,
            busFare: 0,
            walkingDistances: [] // Store walking distances between landmarks
        };
    },
    methods: {
        getSuggestions(inputType) {
            const autocompleteService = new google.maps.places.AutocompleteService();
            const input = inputType === 'start' ? this.start : this.end;

            if (input.length > 2) {
                autocompleteService.getPlacePredictions({ input }, (predictions, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                        if (inputType === 'start') {
                            this.startSuggestions = predictions;
                        } else {
                            this.endSuggestions = predictions;
                        }
                    }
                });
            } else {
                if (inputType === 'start') {
                    this.startSuggestions = [];
                } else {
                    this.endSuggestions = [];
                }
            }
        },
        selectSuggestion(suggestion, inputType) {
            if (inputType === 'start') {
                this.start = suggestion.description;
                this.startSuggestions = [];
            } else {
                this.end = suggestion.description;
                this.endSuggestions = [];
            }
        },
        setCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const { latitude, longitude } = position.coords;
                    this.reverseGeocode(latitude, longitude);
                    this.center = { lat: latitude, lng: longitude }; // Center map on current location
                }, error => {
                    console.error("Error getting current location:", error);
                });
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        },
        reverseGeocode(lat, lng) {
            const geocoder = new google.maps.Geocoder();
            const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };

            geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        this.start = results[0].formatted_address;
                    } else {
                        console.error("No results found");
                    }
                } else {
                    console.error("Geocoder failed due to: " + status);
                }
            });
        },
        async getDirections() {
            const directionsService = new google.maps.DirectionsService();

            directionsService.route({
                origin: this.start,
                destination: this.end,
                travelMode: 'DRIVING', // Adjust travelMode as per your use case
                provideRouteAlternatives: true, // Fetch multiple routes
                transitOptions: {
                    modes: ['BUS'], // Try to get bus routes first
                    // routingPreference: 'FEWER_TRANSFERS', // Optional: Adjust to allow fewer transfers
                },
            }, (response, status) => {
                if (status === 'OK') {
                    this.displayMultipleRoutes(response.routes);
                } else if (status === 'ZERO_RESULTS') {
                    alert('No routes found between the selected locations.');
                    console.log('No bus routes found, trying walking directions...');
                    this.getWalkingDirections();
                } else if (status === 'OVER_QUERY_LIMIT') {
                    alert('The app has exceeded the number of requests allowed. Please try again later.');
                } else if (status === 'NOT_FOUND') {
                    alert('One of the locations you entered could not be found. Please enter valid locations.');
                } else {
                    console.error('Directions request failed due to ' + status);
                    alert('An error occurred while fetching routes. Please try again.');
                }
            });
        },
        // Function to get walking routes if no bus routes are found
        getWalkingDirections() {
            const directionsService = new google.maps.DirectionsService();
            directionsService.route({
                origin: this.start,
                destination: this.end,
                travelMode: 'WALKING',
            }, (response, status) => {
                if (status === 'OK') {
                    // Walking route found, plot it on the map
                    this.plotRoute(response);
                } else if (status === 'ZERO_RESULTS') {
                    // No walking routes found, attempt driving directions
                    console.log('No walking routes found, trying driving directions...');
                    this.getDrivingDirections();
                } else {
                    console.error('Walking route request failed due to ' + status);
                    alert('An error occurred while fetching walking directions.');
                }
            });
        },
        // Function to get driving routes if no walking routes are found
        getDrivingDirections() {
            const directionsService = new google.maps.DirectionsService();
            directionsService.route({
                origin: this.start,
                destination: this.end,
                travelMode: 'DRIVING',
            }, (response, status) => {
                if (status === 'OK') {
                    // Driving route found, plot it on the map
                    this.plotRoute(response);
                } else {
                    console.error('Driving route request failed due to ' + status);
                    alert('No driving routes found. Unable to find a route between the specified locations.');
                }
            });
        },

        plotRoutes(directionsResponse) {
            const routes = directionsResponse.routes;
            const colors = ['#FF0000', '#00FF00', '#0000FF']; // Different colors for each route

            this.polylinePaths = routes.map((route, index) => ({
                path: route.overview_path.map(point => ({ lat: point.lat(), lng: point.lng() })),
                color: colors[index % colors.length] // Cycle through colors
            }));
        },
        displayMultipleRoutes(routes) {
            this.polylinePath = [];
            this.markers = [];

            routes.forEach((route) => {
                const polylineOptions = {
                    path: route.overview_path.map(point => ({
                        lat: point.lat(),
                        lng: point.lng(),
                    })),
                    strokeColor: this.getRandomColor(),
                    strokeWeight: 4,
                    clickable: true,
                };

                // Add click event to highlight selected route
                polylineOptions.click = () => {
                    this.highlightRoute(route);
                };

                this.polylinePath.push(polylineOptions);

                const markersForRoute = route.legs[0].steps.map(step => ({
                    position: step.start_location,
                }));

                // Fetch and display landmarks along the route
                this.fetchLandmarks(route);

                this.markers.push(...markersForRoute);
            });
        },

        // Function to generate random colors for different routes
        getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },

        highlightRoute(route) {
            // Logic to highlight the selected route (e.g., by increasing stroke weight or changing color)
            this.polylinePath = this.polylinePath.map((polyline) => {
                if (polyline.path === route.overview_path) {
                    polyline.strokeWeight = 6; // Highlight selected route
                    polyline.strokeColor = '#FF0000'; // Change to red
                } else {
                    polyline.strokeWeight = 4; // Reset other routes
                    polyline.strokeColor = this.getRandomColor();
                }
                return polyline;
            });
        },

        // Landmark Fetching
        async fetchLandmarks(route) {
            try {
                const response = await axios.get('http://localhost:3000/api/landmarks');
                const allLandmarks = response.data;

                this.landmarks = allLandmarks.filter(landmark => {
                    return route.some(point => this.isPointClose(point, landmark));
                });

                // Calculate walking distances between consecutive landmarks
                this.calculateWalkingDistances();
            } catch (err) {
                console.error("Failed to fetch landmarks:", err);
            }
        },
        async calculateWalkingDistances() {
            // const distanceService = new google.maps.DistanceMatrixService();
            const landmarkPairs = [];

            // Create landmark pairs for distance calculation
            for (let i = 0; i < this.landmarks.length - 1; i++) {
                landmarkPairs.push({
                    origin: { lat: this.landmarks[i].latitude, lng: this.landmarks[i].longitude },
                    destination: { lat: this.landmarks[i + 1].latitude, lng: this.landmarks[i + 1].longitude }
                });
            }

            // Calculate distances for each pair
            for (let pair of landmarkPairs) {
                const result = await this.getWalkingDistance(pair.origin, pair.destination);
                this.walkingDistances.push(result);
            }
        },
        getWalkingDistance(origin, destination) {
            return new Promise((resolve, reject) => {
                const distanceService = new google.maps.DistanceMatrixService();
                distanceService.getDistanceMatrix(
                    {
                        origins: [origin],
                        destinations: [destination],
                        travelMode: 'TRANSIT', // You can also change this to 'WALKING' or 'DRIVING' if necessary
                        unitSystem: google.maps.UnitSystem.METRIC,
                    },
                    (response, status) => {
                        if (status === 'OK') {
                            const element = response.rows[0].elements[0];
                            if (element.status === 'OK' && element.distance) {
                                // If distance is found, resolve with the distance text
                                const distance = element.distance.text;
                                resolve(distance);
                            } else {
                                // If no valid distance is found, resolve with a default message or value
                                console.warn('No distance data found between the specified points.');
                                resolve('Distance unavailable');
                            }
                        } else {
                            // Handle API errors
                            console.error('Error calculating distance: ' + status);
                            reject('Error calculating distance: ' + status);
                        }
                    }
                );
            });
        },
        isPointClose(point, landmark) {
            const distanceThreshold = 0.001;
            const distance = Math.sqrt(
                Math.pow(point.lat - landmark.latitude, 2) + Math.pow(point.lng - landmark.longitude, 2)
            );
            return distance < distanceThreshold;
        }
    }
};
</script>

<style>
/* Add your styles here */
.landmark-section {
    background-color: #f4f4f4;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.journey-info {
    display: flex;
    justify-content: space-around;
    padding: 10px;
    background-color: #f8f8f8;
    border-bottom: 1px solid #ddd;
}

#map-container {
    width: 100%;
    height: 90vh;
}
</style>
