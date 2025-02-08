<template>
    <!-- <div>{{ center }}</div><br>
    <div>{{ markerPosition }}</div><br>
    <div>{{ polylinePath }}</div><br>
    <br><br> -->
    <form @submit.prevent="getDirections">
        <div class="space-y-4 m-5">
            <div>
                <label class="text-base font-medium text-gray-900">
                    Start
                </label>
                <div class="mt-2 flex lg:w-1/2 mx-auto">
                    <input v-model="start" placeholder="Starting Point" type="text"
                        class="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        name="starting_point" />

                    <button type="button" @click="setCurrentLocation"
                        class="group cursor-pointer outline-none ms-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="2.5rem" height="2.5rem" viewBox="0 0 24 24"
                            class="stroke-gray-500 fill-none  group-active:stroke-gray-500 group-active:duration-0 duration-300">
                            <path
                                d="M21 12C21 16.9706 16.9706 21 12 21M21 12C21 7.02944 16.9706 3 12 3M21 12H17M12 21C7.02944 21 3 16.9706 3 12M12 21V17M3 12C3 7.02944 7.02944 3 12 3M3 12H7M12 3V7M12 12H12.01"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>

                        <!-- <span
                            class="absolute opacity-0 group-hover:opacity-100 group-hover:text-gray-700 group-hover:text-sm group-hover:-translate-y-16 group-hover:-translate-x-52 duration-700">
                            Get Current Position
                        </span> -->
                    </button>
                </div>
            </div>

            <div>
                <label class="text-base font-medium text-gray-900">
                    Destination
                </label>
                <div class="mt-2">
                    <input v-model="end" placeholder="End Point" type="text"
                        class="flex h-10 w-full lg:w-1/2 mx-auto rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        name="ending_point" />
                </div>
            </div>

            <button
                class="inline-flex w-full lg:w-1/2 items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                type="submit">
                Get Directions
            </button>
        </div>
        <!-- <input v-model="start" placeholder="Starting Point" /> -->
        <!-- <button type="button" @click="setCurrentLocation">Use Current Location</button> -->
        <!-- <input v-model="end" placeholder="End Point" /> -->
        <!-- <button type="submit">Get Directions</button> -->
    </form>

    <br>
    <GmapMap :center="center" :zoom="zoom" :style="mapStyle">
        <GmapMarker v-for="(m, index) in markers" :key="index" :position="m.position" :clickable="true"
            :draggable="true" />
        <GmapMarker v-for="(p, index) in places" :key="index"
            :position="{ lat: p.geometry.location.lat, lng: p.geometry.location.lng }" :clickable="true"
            :title="p.name" />
        <GmapPolyline :path="polylinePath" :options="{ strokeColor: '#FF0000', strokeWeight: 2 }" />
    </GmapMap>
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
            start: '',
            end: '',
            center: { lat: 6.0329, lng: 80.2168 }, // Default center
            zoom: 13,
            mapStyle: "width: 100vw; height: 90vh",
            markers: [],
            polylinePath: [],
            places: []
        };
    },
    methods: {
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
        getDirections() {
            const directionsService = new google.maps.DirectionsService();
            directionsService.route({
                origin: this.start,
                destination: this.end,
                travelMode: 'TRANSIT'
            }, async (response, status) => {
                if (status === 'OK') {
                    const route = response.routes[0].overview_path.map(point => ({
                        lat: point.lat(),
                        lng: point.lng()
                    }));
                    this.polylinePath = route;
                    this.center = route.length ? route[0] : this.center;
                    this.markers = response.routes[0].legs[0].steps.map(step => ({
                        position: step.start_location
                    }));

                    // Fetch landmarks along the route
                    try {
                        const landmarkResponse = await axios.post('http://localhost:3000/api/landmarks', { polylinePath: route });
                        this.landmarks = landmarkResponse.data;
                    } catch (error) {
                        console.error('Error fetching landmarks:', error);
                    }
                } else {
                    console.error('Directions request failed due to ' + status);
                }
            });
        }
    },
    mounted() {
    }
};
</script>
