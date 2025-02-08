<template>
    <!-- Header Section -->
    <header class="relative z-50 w-full h-24">
        <div
            class="container flex items-center justify-center h-full max-w-6xl px-8 mx-auto sm:justify-between xl:px-0">

            <router-link to="/" class="relative flex items-center inline-block h-5 h-full font-black leading-none">
                <!-- <svg class="w-auto h-6 text-yellow-600 fill-current" viewBox="0 0 194 116"
                    xmlns="http://www.w3.org/2000/svg">
                    <g fill-rule="evenodd">
                        <path
                            d="M96.869 0L30 116h104l-9.88-17.134H59.64l47.109-81.736zM0 116h19.831L77 17.135 67.088 0z" />
                        <path d="M87 68.732l9.926 17.143 29.893-51.59L174.15 116H194L126.817 0z" />
                    </g>
                </svg> -->
                <img class="w-auto h-12 text-yellow-600 fill-current" src="../assets/img/logo-black-yellow.svg" alt="">
                <span class="ml-3 text-xl text-gray-800">Wander<span class="text-yellow-600">.</span>Wise</span>
            </router-link>

            <nav id="nav"
                class="absolute top-0 left-0 z-50 flex flex-col items-center justify-between w-full h-64 pt-5 mt-24 text-sm text-gray-800 bg-white border-t border-gray-200 md:w-auto md:flex-row md:h-24 lg:text-base md:bg-transparent md:mt-0 md:border-none md:py-0 md:flex md:relative"
                :class="{ hidden: showNav }">
                <router-link to="/"
                    class="ml-0 mr-0 font-bold duration-100 md:ml-12 md:mr-3 lg:mr-8 transition-color hover:text-yellow-500 capitalize">home</router-link>
                <router-link to="/about"
                    class="mr-0 font-bold duration-100 md:mr-3 lg:mr-8 transition-color hover:text-yellow-500 capitalize">about</router-link>
                <router-link to="/plan-journey"
                    class="mr-0 font-bold duration-100 md:mr-3 lg:mr-8 transition-color hover:text-yellow-500 capitalize">plan
                    my journey</router-link>
                <router-link to="/landmarks"
                    class="mr-0 font-bold duration-100 md:mr-3 lg:mr-8 transition-color hover:text-yellow-500 capitalize">landmarks</router-link>
                <router-link to="/chatbot"
                    class="font-bold py-1 px-3 border rounded-lg hover:bg-yellow-400  border-transparent transition-all duration-500 relative">
                    <span class="relative py-1 z-10 text-yellow-400 hover:text-white duration-500">Wise AI</span>
                    <div class="absolute inset-0 rounded-lg glow-animation"></div>
                </router-link>

            </nav>

            <div id="nav-mobile-btn"
                class="absolute top-0 right-0 z-50 block w-6 mt-8 mr-10 cursor-pointer select-none md:hidden sm:mt-10"
                :class="{ close: !showNav }" @click="toggleNav">
                <span class="block w-full h-1 mt-2 duration-200 transform bg-gray-800 rounded-full sm:mt-1"></span>
                <span class="block w-full h-1 mt-1 duration-200 transform bg-gray-800 rounded-full"></span>
            </div>

        </div>
    </header>
    <!-- End Header Section-->
</template>

<script>

export default {
    data() {
        return {
            showNav: false, // Initial state of the navigation menu
            // hide: true, // To add "hidden" classes to unwanted stuffs
        };
    },
    methods: {
        toggleNav() {
            this.showNav = !this.showNav; // Toggle the navigation menu
        },
    },
}
</script>

<style lang="scss" scoped>
/* small css for the mobile nav close */
#nav-mobile-btn.close span:first-child {
    transform: rotate(45deg);
    top: 4px;
    position: relative;
    background: #a0aec0;
}

#nav-mobile-btn.close span:nth-child(2) {
    transform: rotate(-45deg);
    margin-top: 0px;
    background: #a0aec0;
}

// AI Button
@keyframes glowing {
    0% {
        box-shadow: 0 0 5px #facc15, 0 0 10px #fde047, 0 0 15px #fef08a, 0 0 20px #fef9c3;
    }
    50% {
        box-shadow: 0 0 10px #facc15, 0 0 20px #fde047, 0 0 30px #fef08a, 0 0 40px #fef9c3;
    }
    100% {
        box-shadow: 0 0 5px #facc15, 0 0 10px #fde047, 0 0 15px #fef08a, 0 0 20px #fef9c3;
    }
}

.glow-animation {
    animation: glowing 2s infinite;
}
</style>