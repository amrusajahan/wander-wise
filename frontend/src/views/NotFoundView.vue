<template>
    <!-- component -->
<main class="h-screen w-full flex flex-col justify-center items-center bg-gray-800">
	<h1 class="text-9xl font-extrabold text-white tracking-widest">404</h1>
	<div class="bg-yellow-500 px-2 text-sm rounded rotate-12 absolute">
		Page Not Found
	</div>
	<button class="mt-5">
      <a
        class="relative inline-block text-sm font-medium text-yellow-600 group active:text-yellow-500 focus:outline-none focus:ring"
      >
        <span
          class="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-yellow-700 group-hover:translate-y-0 group-hover:translate-x-0"
        ></span>

        <span class="relative block px-8 py-3 bg-gray-800 border border-current">
          <router-link to="/">Go Home</router-link>
        </span>
      </a>
    </button>
</main>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>

</style>