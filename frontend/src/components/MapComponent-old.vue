<!-- components/MapComponent.vue -->
<template>
    <div>{{ center }}</div><br>
    <div>{{ markerPosition }}</div><br>
    <div>{{ polylinePath }}</div><br>
    <br><br>
    <form @submit.prevent="getDirections">
        <input v-model="start" placeholder="Starting Point" />
        <button @click="setCurrentLocation">Use Current Location</button>
        <input v-model="end" placeholder="End Point" />
        <button type="submit">Get Directions</button>
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
// import axios from 'axios';
// import { GmapMap, GmapMarker, GmapPolyline } from '@fawmi/vue-google-maps';
import { Map as GmapMap, Polyline as GmapPolyline, Marker as GmapMarker } from '@fawmi/vue-google-maps';

export default {
    components: {
        GmapMap,
        GmapMarker,
        GmapPolyline
    },
    data() {
        return {
            // center: { lat: 0, lng: 0 },
            // markers: [],
            center: { lat: 6.0329, lng: 80.2168 }, // Initial values with required properties
            zoom: 13,
            mapStyle: "width: 100vw; height: 90vh",
            options: {
                zoomControl: true,
                mapTypeControl: true,
                scaleControl: true,
                streetViewControl: true,
                rotateControl: true,
                fullscreenControl: true
            },
            markerPosition: {}, // Initial values with required properties
            polylinePath: [],
            places: []
        };
    },
    methods: {
        fetchRoute() {
            // axios.get('http://localhost:3000/api/route?start=START_POINT&end=END_POINT')
            //     .then(response => {
            //         const data = response.data;
            //         this.center = data.center;
            //         this.markers = data.waypoints.map(wp => ({ position: wp }));
            //         this.polylinePath = data.waypoints;
            //         this.places = data.places;
            //     })
            //     .catch(error => console.log(error));

            // Test Data
            const data = {
                center: { lat: 6.0329, lng: 80.2168 },
                waypoints: [
                    { lat: 6.2329, lng: 81.2168 },
                    { lat: 6.0330, lng: 80.2170 }
                ],
                places: [
                    {
                        name: 'Place 1',
                        geometry: {
                            location: {
                                lat: 6.2329,
                                lng: 81.2168
                            }
                        }
                    },
                    {
                        name: 'Place 2',
                        geometry: {
                            location: {
                                lat: 6.0330,
                                lng: 80.2170
                            }
                        }
                    }
                ]
            };

            // Assigning test data to component state
            this.center = data.center;
            this.markers = data.waypoints.map(wp => ({ position: wp }));
            this.polylinePath = data.waypoints;
            this.places = data.places;
        }, 
        setCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    this.startPointCoordinates = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    this.startPoint = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
                    this.center = this.startPointCoordinates; // Center map on current location
                }, error => {
                    console.error("Error getting current location:", error);
                });
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        },
        getDirections() {
            const directionsService = new google.maps.DirectionsService();
            directionsService.route({
                origin: this.start,
                destination: this.end,
                travelMode: 'TRANSIT'
            }, (response, status) => {
                if (status === 'OK') {
                    const route = response.routes[0].overview_path.map(point => {
                        return { lat: point.lat(), lng: point.lng() };
                    });
                    this.polylinePath = route;
                    this.center = route.length ? route[0] : this.center;
                    this.markers = response.routes[0].legs[0].steps.map(step => {
                        return { position: step.start_location };
                    });
                    // this.fetchLandmarks();
                } else {
                    console.error('Directions request failed due to ' + status);
                }
            });
        },
    },
    mounted() {
        // this.fetchRoute();
    }
};
</script>