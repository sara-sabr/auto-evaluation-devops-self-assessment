<template>
  <div class="home">
    <BaseNavigation />
    <div>
      <HomeSectionsContainer
        :sections="sections"
        :survey="survey"
        :section-recommendation="sectionRecommendation"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Model, PageModel, PanelModel } from "survey-vue";
import showdown from "showdown";

import AssessmentTool from "@/components/AssessmentTool.vue"; // @ is an alias to /src
import ActionButtonBar from "@/components/ActionButtonBar.vue";
import HomeSectionsContainer from "@/components/HomeSectionsContainer.vue";
import BaseNavigation from "@/components/BaseNavigation.vue";
import SurveyFile from "@/interfaces/SurveyFile";
import i18n from "@/plugins/i18n";
import surveyJSON from "@/survey-enfr.json";
import { SectionRecommendation } from "@/store/state";
import resultsData from "@/survey-results.json";
import { ActionTypes } from "@/store/actions";

@Component({
  components: {
    AssessmentTool,
    ActionButtonBar,
    BaseNavigation,
    HomeSectionsContainer
  }
})
export default class Home extends Vue {
  @Prop() public survey!: Model;
  // survey: Model = new Model(surveyJSON);
  sections: PageModel[] = this.$store.getters.returnSectionsByPrefix(
    this.survey,
    resultsData.settings.sectionsPrefix
  );
  sectionRecommendation: SectionRecommendation[] =
    resultsData.sectionRecommendations;

  // Feature removed, used to reset local storage
  // startAgain() {
  //   this.survey.clear(true, true);
  //   window.localStorage.clear();
  //   this.$store.commit("resetSurvey");
  // }

  fileLoaded($event: SurveyFile) {
    this.survey.data = $event.data;
    this.survey.currentPageNo = $event.currentPage;
    this.survey.start();
    this.$store.dispatch(ActionTypes.SaveAppData, this.survey);
  }

  @Watch("$i18n.locale")
  changeLanguage(value: string, oldValue: string) {
    this.survey.locale = value;
    this.survey.render();
  }

  created() {
    /** Disabled - no longer used */
    // this.survey.css = {
    //   navigationButton: "btn survey-button"
    // };

    /** Disabled - no longer used */
    // this.survey.onComplete.add(result => {
    //   this.$store.dispatch(ActionTypes.SaveAppData, result);
    //   this.$router.push("/results");
    // });

    const converter = new showdown.Converter();

    this.survey.onTextMarkdown.add(function(survey, options) {
      //convert the markdown text to html
      var str = converter.makeHtml(options.text);
      //remove root paragraphs <p></p>
      str = str.substring(3);
      str = str.substring(0, str.length - 4);
      //set html
      options.html = str;
    });

    // Set locale
    this.survey.locale = i18n.locale;

    // accessibility fix... aria-labelledby being needlessly generated for html question
    // TODO: make this dynamic by looping over questions and doing this for all html questions
    this.survey.onAfterRenderQuestion.add(function(sender, options) {
      let welcomePage = document.getElementsByName("welcome1");
      if (welcomePage && welcomePage.length > 0) {
        let welcomePageElement = welcomePage[0];
        welcomePageElement.removeAttribute("aria-labelledby");
      }
    });

    //if survey is in progress reload from store
    if (this.$store.getters.inProgress) {
      this.fileLoaded({
        currentPage: this.$store.state.currentPageNo,
        data: this.$store.state.toolData
      } as SurveyFile);
    }
  }
}
</script>
