<template>
  <!-- ====== ABOUT PART START ====== -->

  <section id="why" class="pt-120 relative">
    <div class="relative flex flex-col items-center justify-center min-h-screen bg-white bg-cover min-w-screen">
      <div
        class="flex flex-col flex-col-reverse items-center justify-center p-10 mx-auto lg:flex-row lg:max-w-6xl lg:p-0">
        <div class="w-full lg:w-1/2">
          <div class="mx-4 pt-11 lg:pt-15 lg:pb-15">
            <div class=" pb-9">
              <h5 class="uppercase pb-4">About Us</h5>
              <h4
                class="relative z-20 text-4xl font-extrabold leading-none text-black sm:text-5xl xl:text-6xl sm:text-center lg:text-center">
                <span class="bg-black text-yellow-500">WanderWise</span> made bussing easier for you!
              </h4>
            </div> <!-- section title -->

            <p
              class="relative z-20 block mt-6 text-xl text-gray-800 xl:text-lg sm:text-center lg:text-center font-bold">
              Why WanderWise?</p>
            <span class="relative bottom-0 left-0 inline-block w-1/2 h-1 bg-yellow-500 -z-10"></span>
            <ul class=" pt-3">
              <li v-for="reason in reasons" :key="reason" class="flex mt-5">
                <div class="">
                  <i class=""></i>
                </div>
                <div class=" pl-5 pr-2">
                  <p class="font-bold">{{ reason.title }}</p>
                  <p>{{ reason.desc }}</p>
                </div>
              </li>
            </ul>
          </div> <!-- about content -->
        </div>
        <div class="relative w-full pr-10 rounded-lg cursor-pointer md:w-2/3 lg:w-1/2 group">
          <div class="relative rounded-md">
            <!-- <img src="https://cdn.devdojo.com/images/september2020/grow-together.png"
                        class="z-10 object-cover w-full h-full"> -->
            <img src="@\assets\img\logo.svg" class="z-10 object-cover w-full h-full">
          </div>
        </div>

      </div>
    </div>

    <div
      class="relative flex flex-col xl:flex-row lg:flex-row md:flex-col items-center justify-around min-h-screen bg-white bg-cover ">

      <div
        class="group flex flex-col justify-start items-start gap-2 w-auto mx-5 lg:w-96 md:w-96 h-56 duration-500 relative rounded-lg p-4 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:-translate-y-2 hover:shadow-xl shadow-gray-300">
        <div
          class="absolute duration-700 shadow-md group-hover:-translate-y-4 group-hover:-translate-x-4 -bottom-10 -right-0 lg:-right-10 md:-right-10  w-1/2 h-1/2 rounded-lg bg-gray-200 group-hover:opacity-0"
          alt="image here"></div>

        <div class="">
          <h2 class="text-2xl font-bold mb-2 text-gray-800">Our Mission</h2>
          <p class="text-gray-700 line-clamp-6">
            At WanderWise, we believe that travel should be accessible, convenient, and enjoyable for
            everyone. Our
            mission is to simplify public transportation, starting with bus routes and landmarks in Galle, Sri Lanka.
            By
            providing accurate information, easy-to-use tools, and personalized recommendations, we empower travelers
            to
            explore the rich cultural heritage and natural beauty of this historic city.
          </p>
        </div>
      </div>

      <div
        class="group flex flex-col justify-start items-start gap-2 w-auto mx-5 lg:w-96 md:w-96 h-56 duration-500 relative rounded-lg p-4 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:bg-gradient-to-l hover:-translate-y-2 hover:shadow-xl shadow-gray-300">
        <div
          class="absolute shadow-md group-hover:-translate-y-4 group-hover:-translate-x-4 -bottom-10 -right-0 lg:-right-10 md:-right-10 w-1/2 h-1/2 rounded-lg bg-gray-200 group-hover:opacity-0 duration-700"
          alt="image here"></div>

        <div class="">
          <h2 class="text-2xl font-bold mb-2 text-gray-800">Our Vision</h2>
          <p class="text-gray-700 line-clamp-6">
            WanderWise is just the beginning. As we expand, our vision is
            to create a global
            platform that connects
            travelers with reliable public transportation information in every city. Whether you’re exploring the
            bustling
            streets of Tokyo, the serene canals of Venice, or the vibrant neighborhoods of New York, WanderWise will
            be
            your trusted companion.
          </p>
        </div>
      </div>

    </div>
  </section>

  <!--====== ABOUT PART ENDS ======-->
</template>

<script>


export default {
  name: 'AboutView',
  data() {
    return {
      reasons: [
        {
          title: "Affordability",
          desc: "Buses are a cost-effective way to get around, and we’re committed to making your journey even more budget-friendly."
        },
        {
          title: "Landmarks and Heritage",
          desc: "Galle boasts a wealth of historical sites, stunning beaches, and vibrant markets. WanderWise helps you discover these hidden gems."
        },
        {
          title: "Community-Driven",
          desc: "We’re not just an app; we’re a community. Share your experiences, tips, and favorite routes with fellow travelers."
        },
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>