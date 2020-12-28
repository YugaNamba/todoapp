<template>
  <div>
    <h1>LINELOGIN</h1>
    <!-- <p>{{ this.$store.getters.user }}</p> -->
  </div>
</template>

<script>
import { functions } from "~/plugins/firebase";

export default {
  async mounted(){
    await this.$store.dispatch('lineLogin/liffinit')
    await this.$store.dispatch('lineLogin/auth')
  }
}
</script>