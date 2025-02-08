<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg p-8 w-96 text-center">
            <h3 class="text-2xl font-semibold mb-4">{{ landmark.landmark }}</h3>
            <img :src="landmark.imgUrl" alt="Landmark Image" class="w-full h-40 object-cover rounded mb-4" />
            <p class="mb-2"> {{ landmark.desc }}</p>
            <p class="mb-2"><strong>Latitude:</strong> {{ landmark.latitude }}</p>
            <p class="mb-2"><strong>Longitude:</strong> {{ landmark.longitude }}</p>
            <button @click="closeModal" class="mt-4 px-4 py-2 bg-red-500 text-white rounded">Close</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LandmarkModal',
    props: {
        show: Boolean,
        landmark: Object,
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
    },
};
</script>

<style scoped>
/* Add additional styling for the modal if needed */
</style>