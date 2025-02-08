<template>
    <div class="flex flex-wrap justify-center gap-6 p-4">
        <div v-for="landmark in Landmarks" :key="landmark.id" class="flex flex-col">
            <LandmarkCard :landmark="landmark.landmark" :desc="landmark.description" :latitude="landmark.latitude"
                :longitude="landmark.longitude" :imgUrl="landmark.image" @show-more="openModal" />
            <!-- <img src="../assets/img/landmark-img/5 Ways View Point Koggala.jpg" alt=""> -->
        </div>

        <!-- Modal for displaying more details -->
        <LandmarkModal :show="isModalOpen" :landmark="selectedLandmark" @close="isModalOpen = false" />
    </div>
</template>

<script>
import Landmarks from '@/assets/json/landmarks.json'
import LandmarkCard from '@/components/LandmarkCard.vue'
import LandmarkModal from '@/components/LandmarkModal.vue'

export default {
    name: 'LandmarksView',
    components: {
        LandmarkCard,
        LandmarkModal
    },
    data() {
        return {
            Landmarks,
            isModalOpen: false,
            selectedLandmark: {},
        }
    },
    methods: {
        openModal(landmark) {
            this.selectedLandmark = landmark;
            this.isModalOpen = true;
        },
    },
}
</script>

<style scoped>
/* Add any additional styles here */
</style>
