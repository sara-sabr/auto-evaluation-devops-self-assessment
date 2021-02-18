<template>
  <div class="results">
    <h1>{{ $t("resultTitle") }}</h1>
    <BaseNavigation v-on:exportResults="exportResults" />
    <form>
      <ActionButtonBar
        v-on:fileLoaded="fileLoaded($event)"
        v-on:startAgain="startAgain"
      />
      <ResultsCard
        :section="section"
        :section-name="sectionName"
        :user-score="section.userScore"
        :my-recommendations="myRecommendations"
        :locale="locale"
      />
    </form>
    <div class="row" style="padding: 0 5px">
      <div class="col-3 col-sm-2 col-md-3">
        <button
          type="button"
          class="btn survey-button"
          style="width: inherit"
          v-on:click="goToHomePage()"
        >
          {{ $t("navigation.chooseAnotherSection") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import BaseNavigation from "@/components/BaseNavigation.vue";
import { Section } from "@/types";
@Component({
  components: {
    BaseNavigation
  }
})
export default class SectionResults extends Vue {
  @Prop() public section!: Section;
}
</script>
