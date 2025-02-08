<template>
    <div>
        <!-- Journey Info -->
        <div class="journey-info bg-gray-50 p-6 rounded-lg shadow-lg">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Journey Options</h2>

            <div v-if="polylinePaths.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="(route, index) in polylinePaths" :key="index"
                    :style="{ backgroundColor: route.strokeColor }"
                    class="route-option text-white bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl p-6">

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Route {{ index + 1 }}</h3>

                    <div class="text-gray-600 mb-4">
                        <p><strong>Distance:</strong> {{ route.distance }} km</p>
                        <p><strong>Carbon Footprint:</strong> {{ route.carbonFootprint }} kg CO2</p>
                        <p><strong>Bus Fare:</strong> {{ route.busFare }} LKR</p>
                    </div>

                    <h4 class="mt-4 text-lg font-semibold text-gray-700">Landmarks Along This Route:</h4>
                    <ul class="list-disc pl-6 space-y-1 text-gray-600">
                        <li v-for="(landmark, lIndex) in landmarksByRoute[index]" :key="lIndex">
                            {{ landmark.landmark }}
                        </li>
                    </ul>
                </div>
            </div>

            <div v-else class="text-center text-gray-500 text-lg">
                No routes found. Please enter valid start and end points.
            </div>
        </div>


        <!-- Directions Form -->
        <form @submit.prevent="getDirections">
            <div class="space-y-4 m-5">
                <!-- Start Input -->
                <div>
                    <label class="text-base font-medium text-gray-900">Start</label>
                    <div class="mt-2 flex lg:w-1/2 mx-auto relative">
                        <input v-model="start" @input="getSuggestions('start')" placeholder="Starting Point" type="text"
                            class="flex h-10 w-full relative rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 z-10" />

                        <!-- Suggestions Dropdown for Start -->
                        <ul v-if="startSuggestions.length"
                            class="absolute z-20 mt-1 w-1/2 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-md shadow-lg">
                            <li v-for="(suggestion, index) in startSuggestions" :key="index"
                                @click="selectSuggestion(suggestion, 'start')"
                                class="px-4 py-2 cursor-pointer hover:bg-gray-100">
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

                <!-- Destination Input -->
                <div>
                    <label class="text-base font-medium text-gray-900">Destination</label>
                    <div class="relative lg:w-1/2 mx-auto">
                        <input v-model="end" @input="getSuggestions('end')" placeholder="End Point" type="text"
                            class="flex h-10 w-full relative rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 z-10" />

                        <!-- Suggestions Dropdown for End -->
                        <ul v-if="endSuggestions.length"
                            class="absolute z-20 mt-1 w-1/2 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-md shadow-lg">
                            <li v-for="(suggestion, index) in endSuggestions" :key="index"
                                @click="selectSuggestion(suggestion, 'end')"
                                class="px-4 py-2 cursor-pointer hover:bg-gray-100">
                                {{ suggestion.description }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Submit Button -->
                <button
                    class="inline-flex w-full lg:w-1/2 items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                    type="submit">
                    Get Directions
                </button>
            </div>
        </form>


        <!-- Google Map -->
        <GmapMap :center="center" :zoom="zoom" :style="mapStyle">
            <GmapPolyline v-for="(polyline, index) in polylinePaths" :key="index" :path="polyline.path"
                :options="{ strokeColor: polyline.strokeColor, strokeWeight: 4 }" />
            <GmapMarker v-for="(landmark, index) in displayedLandmarks" :key="index"
                :position="{ lat: landmark.latitude, lng: landmark.longitude }" :title="landmark.landmark" />
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
        GmapPolyline,
    },
    data() {
        return {
            center: { lat: 6.0329, lng: 80.2168 },
            zoom: 13,
            mapStyle: 'width: 100vw; height: 90vh',
            start: '',
            end: '',
            startSuggestions: [],
            endSuggestions: [],
            polylinePaths: [],
            displayedLandmarks: [],
            landmarksByRoute: [],
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
        setCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const { latitude, longitude } = position.coords;
                    this.center = { lat: latitude, lng: longitude }; // Center map on current location
                    this.reverseGeocode(latitude, longitude); // Reverse geocode after setting the center
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
                        this.start = results[0].formatted_address; // Set the start input field
                    } else {
                        console.error("No results found");
                    }
                } else {
                    console.error("Geocoder failed due to: " + status);
                }
            });
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
        async getDirections() {
            const directionsService = new google.maps.DirectionsService();

            directionsService.route(
                {
                    origin: this.start,
                    destination: this.end,
                    travelMode: 'DRIVING',
                    provideRouteAlternatives: true,
                },
                (response, status) => {
                    if (status === 'OK') {
                        this.displayMultipleRoutes(response.routes);
                    } else {
                        console.error('Directions request failed due to ' + status);
                        alert('An error occurred while fetching routes. Please try again.');
                    }
                }
            );
        },
        displayMultipleRoutes(routes) {
            this.polylinePaths = [];
            this.landmarksByRoute = [];
            this.displayedLandmarks = []; // Clear previously displayed landmarks

            const colors = ['#FF0000', '#00FF00', '#0000FF'];
            routes.forEach(async (route, index) => {
                const polylineOptions = {
                    path: route.overview_path.map(point => ({
                        lat: point.lat(),
                        lng: point.lng(),
                    })),
                    strokeColor: colors[index % colors.length],
                    distance: (route.legs[0].distance.value / 1000).toFixed(2), // Distance in km
                    // distance: 52,
                    carbonFootprint: this.calculateCarbonFootprint(route.legs[0].distance.value), // Calculate carbon footprint
                    busFare: this.calculateBusFare(route.legs[0].distance.value), // Calculate bus fare
                };
                this.polylinePaths.push(polylineOptions);

                const landmarks = await this.fetchLandmarks(route.overview_path);
                this.landmarksByRoute.push(landmarks);
                this.displayedLandmarks = [...this.displayedLandmarks, ...landmarks]; // Combine landmarks to be displayed
            });
        },
        calculateCarbonFootprint(distance) {
            // Example calculation: 0.012 kg CO2 per km
            return ((distance / 1000) * 0.012).toFixed(2);
        },
        calculateBusFare(distance) {
            // Example calculation: 30 LKR per km
            return Math.ceil((distance / 1000) * 30);
        },
        async fetchLandmarks(routePath) {
            try {
                const response = await axios.get('http://localhost:3000/api/landmarks'); // Replace with your API endpoint
                const landmarks = response.data;

                // Filter landmarks that are near the route within 10 meters
                return landmarks.filter(landmark => {
                    return routePath.some(point => this.isPointClose(point, landmark));
                });
            } catch (error) {
                console.error('Error fetching landmarks:', error);
                return [];
            }
        },
        isPointClose(point, landmark) {
            const distanceThreshold = 0.001; // Adjusted for 100 meters (latitude and longitude degrees)
            const distance = Math.sqrt(
                Math.pow(point.lat() - landmark.latitude, 2) +
                Math.pow(point.lng() - landmark.longitude, 2)
            );
            return distance < distanceThreshold;
        },
    },
};
</script>

<style scoped>
.journey-info {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.route-option {
    margin-bottom: 15px;
}

.input-field {
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    margin-top: 5px;
}

.btn-submit {
    background-color: #007bff;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
}

.btn-submit:hover {
    background-color: #0056b3;
}

.suggestions {
    border: 1px solid #ccc;
    max-height: 200px;
    overflow-y: auto;
    position: absolute;
    z-index: 1000;
    background-color: white;
    width: calc(100% - 20px);
}
</style>