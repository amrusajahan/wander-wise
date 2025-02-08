<template>
  <div class="home">
    <HeroCom/>
    <InfographCom/>
  </div>
</template>

<script>
// @ is an alias to /src
import HeroCom from '@/components/HeroCom.vue'
import InfographCom from '@/components/InfographicCom.vue'

export default {
  name: 'HomeView',
  components: {
    HeroCom,
    InfographCom,
  }
}
</script>
