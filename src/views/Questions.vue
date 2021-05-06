<template>
  <div class="results">
    <AssessmentTool :survey="survey" />
    <div class="page-actions">
      <div class="row" style="padding: 0 5px">
        <div class="col-3 col-sm-2 col-md-3">
          <button
            type="button"
            class="btn btn-default"
            style="width: inherit"
            v-on:click="goToHomePage()"
          >
            &#8672;&nbsp;{{ $t("navigation.goBack") }}
          </button>
        </div>
        <div class="col-3 col-sm-2 col-md-3">
          <button
            type="button"
            class="btn btn-primary"
            style="width: inherit"
            v-on:click="goToSectionResults()"
          >
            {{ $t("navigation.viewSectionResults") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Model } from "survey-vue";
import showdown from "showdown";

import AssessmentTool from "@/components/AssessmentTool.vue"; // @ is an alias to /src
import ActionButtonBar from "@/components/ActionButtonBar.vue";
import BaseNavigation from "@/components/BaseNavigation.vue";
import SurveyFile from "@/interfaces/SurveyFile";
import i18n from "@/plugins/i18n";
import surveyJSON from "@/survey-enfr.json";
import { actions, ActionTypes } from "@/store/actions";

@Component({
  components: {
    AssessmentTool,
    ActionButtonBar,
    BaseNavigation
  }
})
export default class Questions extends Vue {
  @Prop() public currentPageNo!: number;
  @Prop() public survey!: Model;
  // survey: Model = new Model(surveyJSON);

  /** Feature disabled */
  // startAgain() {
  //   this.survey.clear(true, true);
  //   window.localStorage.clear();
  //   this.$store.commit("resetSurvey");
  //   this.$router.push("/");
  // }

  fileLoaded($event: SurveyFile) {
    this.survey.data = $event.data;
    this.survey.currentPageNo = $event.currentPage;
    this.survey.start();
    this.$store.dispatch(ActionTypes.SaveAppData, this.survey);
    this.$router.push("/");
  }

  goToHomePage() {
    this.$store.dispatch(ActionTypes.SaveAppData, this.survey);
    this.$router.push("/");
  }

  buildSurveyFile(): string {
    return JSON.stringify({
      name: "surveyResults",
      version: this.$store.state.toolVersion,
      currentPage: this.$store.state.currentPageNo,
      data: this.$store.state.toolData
    });
  }
  async saveSurveyData(): Promise<boolean> {
    var responseStatus: boolean = false;
    const saveFile = this.buildSurveyFile();

    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/text"
      },
      mode: "no-cors" as RequestMode,
      name: "surveyData",
      body: saveFile
    };
    await fetch(
      "https://doraselfassessment.azurewebsites.net/api/saveselfassessment",
      requestOptions
    ).then(function(response) {
      if (response.status === 200) {
        responseStatus = true;
      }
    });
    return responseStatus;
  }

  goToSectionResults() {
    this.$store.dispatch(ActionTypes.SaveAppData, this.survey);
    this.saveSurveyData();
    this.$router.push("/sections");
  }
  @Watch("$i18n.locale")
  changeLanguage(value: string, oldValue: string) {
    this.survey.locale = value;
    this.survey.render();
  }
  created() {
    this.survey.onComplete.add(result => {
      this.$store.dispatch(ActionTypes.SaveAppData, result);
      this.$router.push("/results");
    });

    this.survey.onValueChanged.add(result => {
      this.$store.dispatch(ActionTypes.SaveAppData, result);
    });

    this.survey.currentPageNo = this.$store.getters.returnCurrentPageNumber;
    this.survey.data = this.$store.getters.returnToolData;
    this.survey.locale = this.$i18n.locale;
  }
}
</script>
