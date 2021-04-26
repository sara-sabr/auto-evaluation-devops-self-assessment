import { GetterTree } from "vuex";
import { RootState } from "@/store/state";
import isEmpty from "lodash.isempty";
import { Section } from "@/store/state";
import { SurveyModel } from "survey-vue";

export type Getters = {
  inProgress(state: RootState): boolean;
  returnSectionsNames(state: RootState): string[];
  returnSectionByName(
    state: RootState,
    sectionName: string
  ): Section | undefined;
  returnCurrentSection(state: RootState): Section | undefined;
  resultsDataSections(state: RootState): any;
  returnSurveyModel(state: RootState): SurveyModel | undefined;
  returnCurrentPageNumber(state: RootState): number;
};

export const getters: GetterTree<RootState, RootState> & Getters = {
  inProgress(state: RootState) {
    return !isEmpty(state.toolData);
  },
  returnSectionsNames(state: RootState) {
    let sectionsNames: string[] = [];
    if (state.surveyModel !== undefined) {
      state.surveyModel.pages.forEach(page => {
        if (page.name.includes(state.sectionsPrefix)) {
          sectionsNames.push(page.name);
        }
      });
    }
    return sectionsNames;
  },
  returnSectionByName(state: RootState, sectionName: string) {
    return state.sections.find(section => {
      return section.sectionName === sectionName;
    });
  },
  returnCurrentSection(state: RootState) {
    return state.sections.find(section => {
      return section.sectionName === state.currentPageName;
    });
  },
  /**
   * Following functions were kept during refactor to avoid breaking
   * functionalities but should be removed and replaced by
   * mapState instead*/
  resultsDataSections(state: RootState) {
    let allResults = [];
    if (state.toolData === undefined) return {};
    allResults = state.toolData;
    return allResults;
  },
  returnSurveyModel(state: RootState) {
    if (state.surveyModel === undefined) {
      return undefined;
    } else {
      return state.surveyModel;
    }
  },
  returnCurrentPageNumber(state: RootState) {
    return state.currentPageNo;
  }
};
