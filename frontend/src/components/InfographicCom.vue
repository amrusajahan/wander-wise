<template>
    <div class=" py-12 bg-gray-100">
        <section>
            <h2 class="text-4xl font-extrabold text-center text-gray-700">Explore</h2>
            <p class="text-center text-gray-600 text-md">Simple steps to explore the city of Galle.</p>
            <div class="content-center lg:flex lg:justify-center lg:items-center">

                <div v-for="x in infos" :key="x" class="flex justify-center pt-10 m-auto lg:w-1/4 lg:mx-6 lg:my-8">
                    <div class="relative w-64 h-48">
                        <div
                            class="absolute top-0 left-0 flex items-center w-64 h-40 mt-6 ml-6 bg-white border-8 border-gray-700 border-solid rounded-lg">
                            <div class="w-1/3 h-40"></div>
                            <div class="w-2/3 h-32 pr-4">
                                <h3 class="pt-1 text-xl font-semibold text-gray-700">{{ x.title }}</h3>
                                <p class="pt-1 text-sm text-gray-600">{{ x.desc }}</p>
                            </div>
                        </div>
                        <!-- <div class="absolute top-0 left-0 z-20 w-12 h-12 mt-6 ml-6 bg-white rounded-full">
                            <svg class="mt-2 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ca8a04"
                                width="32px" height="32px">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path
                                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                            </svg>
                        </div> -->
                        <div
                            class="absolute top-0 left-0 z-10 w-24 h-40 py-20 text-5xl font-bold text-center text-white  rounded-lg" :class="'bg-yellow-'+x.shade">
                            {{ x.num }}</div>
                        <div class="absolute top-0 left-0 z-30 w-24 h-2 mt-40 ml-48 " :class="'bg-yellow-'+x.shade"></div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    data(){
        return{
            infos:[
                {
                    num: "01",
                    title : "Input Destination",
                    desc : "Enter your desired location.",
                    shade : "500"
                },
                {
                    num: "02",
                    title : "Select Route",
                    desc : "Choose your preferred bus route.",
                    shade : "500"
                },
                {
                    num: "03",
                    title : "Explore Landmarks",
                    desc : "Discover hidden gems along the way.",
                    shade : "700"
                },
            ]
        }
    }

}
</script>

<style lang="scss" scoped></style>