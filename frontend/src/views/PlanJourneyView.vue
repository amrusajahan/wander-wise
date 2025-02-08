<template>
    <div>
        <!-- <MapComponent/> -->
        <!-- <MultiRoute/> -->
        <TestCom />
    </div>
</template>

<script>
// import MapComponent from '@/components/MapComponent.vue'
// import MultiRoute from '@/components/MultiRoute.vue'
import TestCom from '@/components/TestCom.vue';

export default {
    name: 'PlanJourneyView',
    components: {
        // MapComponent,
        // MultiRoute,
        TestCom
    },
    data() {
        return {
            destination: null,
        };
    },
    methods: {
        async calculateRoute() {
            // Fetch route details using Google Maps API
            // Update directions on the map
            // this.directions = await fetchRouteDetails(this.destination);
        },
    },
}
</script>

<style lang="scss" scoped></style>