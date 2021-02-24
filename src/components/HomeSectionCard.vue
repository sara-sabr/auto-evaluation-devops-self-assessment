<template>
  <div
    class="card"
    img-top
    style="min-width: 30rem; margin-top: 15px; margin-bottom: 5px;"
  >
    <i
      :class="setIconClass(icon)"
      style="margin-top: 20px; margin-left: 25px;"
    ></i>
    <div class="card-body">
      <h2 class="card-title">{{ section.title }}</h2>
      <p style="font-size: 16px" class="card-text">
        {{ section.description }}
      </p>
      <button
        type="button"
        class="btn survey-button"
        style="width: inherit"
        v-on:click="goToSection(section.name)"
        :survey="survey"
      >
        {{ $t("navigation.launchThisSection") }}
      </button>
    </div>
    <div class="card-footer">This section's status</div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { PageModel, SurveyModel } from "survey-vue";

@Component({
  components: {},
  methods: {
    setIconClass(icon: string) {
      let classDef: string = "fas fa-" + icon + " fa-3x";
      return classDef;
    }
  }
})
export default class HomeSectionCard extends Vue {
  @Prop() public section!: PageModel;
  @Prop() public survey!: SurveyModel;
  @Prop() public icon!: string;

  goToSection(sectionName: string) {
    this.survey.currentPage = sectionName;
    this.$store.commit("updateSurveyData", this.survey);
    this.$store.commit("updateCurrentPageName", sectionName);
    this.$router.push("/questions");
  }
}
</script>

<style scoped>
h2 {
  font-size: 1.2em !important;
}
</style>
