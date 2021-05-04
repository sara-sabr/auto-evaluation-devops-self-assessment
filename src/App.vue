<template>
  <div id="app">
    <i18n path=""></i18n>
    <BaseNotice />
    <router-view />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import BaseNotice from "@/components/BaseNotice.vue";
export default Vue.extend({
  components: {
    BaseNotice
  },
  mounted() {
    if (this.$store.getters.returnDisplayWelcome === true) {
      this.$bvModal.show("welcome-modal");
    }
  }
});
</script>
