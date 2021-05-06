<template>
  <div id="app">
    <router-view :survey="survey" :recommendations="recommendations" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { ActionTypes } from "./store/actions";
import { Model } from "survey-vue";
import surveyJSON from "@/survey-enfr.json";
import { Recommendations } from "./store/state";

export default class App extends Vue {
  survey: Model = new Model(surveyJSON);
  recommendations: Recommendations = this.$store.getters.returnRecommendations;

  created() {
    this.$store.dispatch(ActionTypes.GetLocalAppData, undefined);
  }
  mounted() {
    if (this.$store.getters.inProgress === false) {
      this.$store.dispatch(ActionTypes.SetAppData, this.survey);
      this.$store.dispatch(ActionTypes.SetSections, this.survey);
    }
  }
}
</script>
