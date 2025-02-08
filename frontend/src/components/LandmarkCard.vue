<template>
    <div class="relative flex w-80 flex-col rounded-xl bg-gray-200 bg-clip-border text-gray-700 shadow-md m-5">
        <div
            class="relative mx-4 -mt-6 h-40  overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r from-blue-500 to-blue-600">
            <img :src="imgUrl" class=" h-fit w-fit" alt="">
            <!-- <img src="../assets/img/landmark-img/5 Ways View Point Koggala.jpg" alt=""> -->
            <!-- <img src="https://firebasestorage.googleapis.com/v0/b/wanderwiise.appspot.com/o/landmarks%2FAkurala%20Beach.jpg?alt=media&token=3d43b65a-ec9f-4bc4-8fe0-41599f6fe3b4" alt=""> -->
        </div>
        <div class="p-6">
            <h5
                class="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                {{ landmark }}
            </h5>
            <p class="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                {{ desc }}
            </p>

            <!-- <p class="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                {{ latitude }}
            </p>

            <p class="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                {{ longitude }}
            </p> -->
        </div>
        <div class="p-6 pt-0">
            <button  @click="$emit('show-more', { landmark, desc, latitude, longitude, imgUrl })" data-ripple-light="true" type="button"
                class="select-none rounded-lg bg-yellow-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                Show More
            </button>
        </div>


    </div>
</template>

<script>
export default {
    name: 'LandmarkCard',
    props: {
        landmark: String,
        desc: String,
        latitude: String,
        longitude: String,
        imgUrl: String
    },
}
</script>

<style lang="scss" scoped></style>