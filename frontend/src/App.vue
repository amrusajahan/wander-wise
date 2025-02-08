<template>
  <HeaderCom/>
  <main>
    <router-view />
  </main>
  <FooterCom/>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

#app {
  font-family: 'Poppins', sans-serif;
  /* changing the font family to Poppins */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  overflow: hidden;
  /* Hide scrollbars */
}


nav {
    padding: 30px;

    a {
        font-weight: bold;
        // color: #2c3e50;

        &.router-link-exact-active {
            color: #ca8a04;
        }
    }
}

</style>

<script>
import HeaderCom from "@/components/HeaderCom.vue"
import FooterCom from "@/components/FooterCom.vue"

export default {
  components: {
    HeaderCom,
    FooterCom
  }
}
</script>
