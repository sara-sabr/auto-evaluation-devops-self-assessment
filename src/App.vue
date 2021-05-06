<template>
  <div id="app">
    <router-view :survey="survey" :recommendations="recommendations" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Model } from "survey-vue";
import surveyJSON from "@/survey-enfr.json";
import { Recommendations } from "./store/state";

export default class App extends Vue {
  survey: Model = new Model(surveyJSON);
  recommendations: Recommendations = this.$store.getters.returnRecommendations;
}
</script>
