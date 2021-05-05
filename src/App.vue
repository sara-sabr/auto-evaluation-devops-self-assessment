<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { ActionTypes } from "./store/actions";
import { Model } from "survey-vue";
import surveyJSON from "@/survey-enfr.json";
export default Vue.extend({
  name: "App",
  data() {
    return { Survey: new Model(surveyJSON) };
  },
  created() {
    this.$store.dispatch(ActionTypes.GetLocalAppData, undefined);
    this.$store.dispatch(ActionTypes.SetAppData, this.Survey);
    this.$store.dispatch(ActionTypes.SetSections, this.Survey);
  }
});
</script>
