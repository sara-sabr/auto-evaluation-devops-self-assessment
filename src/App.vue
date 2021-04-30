<template>
  <div id="app">
    <i18n path=""></i18n>
    <b-button @click="displayWelcomeMessage()">{{
      $t("notice.displayWelcome")
    }}</b-button>
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
  methods: {
    displayWelcomeMessage() {
      this.$bvModal.show("welcome-modal");
    }
  },
  mounted() {
    if (this.$store.getters.returnDisplayWelcome === true) {
      this.$bvModal.show("welcome-modal");
    }
  }
});
</script>
0
