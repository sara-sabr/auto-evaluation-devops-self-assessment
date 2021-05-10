import { GetterTree } from "vuex";
import { Section, Recommendations, RootState } from "@/store/state";
import isEmpty from "lodash.isempty";
import { PageModel, SurveyModel } from "survey-vue";

export type Getters = {
  /**Checks whether the state status is errored or not
   * @returns Returns false if no error, true if error.
   */
  isStateError(state: RootState): boolean;
  /**
   * Checks whether the app data successfully loaded
   * @returns Returns true if app data successfully loaded, false otherwise
   * */
  isInitialized(state: RootState): boolean;
  /**
   * Checks whether the store has any user data saved.
   * @returns Returns true if data is saved, false if not
   */
  inProgress(state: RootState): boolean;
  /**
   * Returns all app sections by name
   * @returns An array of strings containing the sections names, an empty array if there no sections are available.
   * */
  returnSectionsNames(state: RootState): string[];
  /**
   * @param state The store state
   * @param sectionName A string containining the section name to evaluate
   * @returns A Section object if the sectionName is found, undefined if not found.
   */
  returnSectionByName(
    state: RootState
  ): (sectionName: string) => Section | undefined;
  /**Returns all recommendations
   * @param state The store state
   */
  returnRecommendations(state: RootState): Recommendations | undefined;
  returnSectionsByPrefix(
    state: RootState
  ): (surveyData: SurveyModel, prefix: string) => PageModel[];
  returnCurrentSection(state: RootState): Section | undefined;
  returnToolData(state: RootState): any;
  returnSurveyModel(state: RootState): SurveyModel | undefined;
  returnCurrentPageNumber(state: RootState): number;
  // ---------------
  // Getters below are to help transition to new store structure
  // ---------------
  // This getter is never used
  returnSectionsNamesGenerated(state: RootState): string[];
  determineAllSections(state: RootState, payload: string): string[];
  resultsDataSections(state: RootState): any[];
  returnSections(state: RootState): Section[];
  returnDisplayWelcome(state: RootState): boolean;
  returnSectionPrefix(state: RootState): string;
};

export const getters: GetterTree<RootState, RootState> & Getters = {
  isStateError(state: RootState) {
    return state.error;
  },
  isInitialized(state: RootState) {
    return state.initialized;
  },
  inProgress(state: RootState) {
    return !isEmpty(state.toolData);
  },
  returnSectionsNames(state: RootState) {
    return state.sectionsNames;
  },
  returnSectionByName(state: RootState) {
    return (sectionName: string) => {
      return state.sections.find(
        section => section.sectionName === sectionName
      );
    };
  },
  returnRecommendations(state: RootState) {
    if (state.recommendations === undefined) {
      return undefined;
    } else {
      return state.recommendations;
    }
  },
  returnSectionsByPrefix(state: RootState) {
    return (surveyData: SurveyModel, prefix: string) => {
      let sections: PageModel[] = [];
      surveyData.pages.forEach(page => {
        if (page.name.includes(prefix)) {
          sections.push(page);
        }
      });
      return sections;
    };
  },
  returnCurrentSection(state: RootState) {
    return state.sections.find(section => {
      return section.sectionName === state.currentPageName;
    });
  },
  // ---------------
  // Getters below are to help transition to new store structure
  // ---------------
  resultsDataSections(state: RootState) {
    let allResults: any[] = [];
    if (state.toolData !== undefined) {
      allResults = state.toolData;
    }
    return allResults;
  },
  returnSectionsNamesGenerated(state: RootState) {
    let sectionsNames: string[] = [];
    if (state.surveyModel === undefined) return sectionsNames;
    state.surveyModel.pages.forEach(page => {
      if (page.name.includes(state.sectionsPrefix)) {
        sectionsNames.push(page.name);
      }
    });
    return sectionsNames;
  },
  determineAllSections(state: RootState, payload: string) {
    let sectionsNames: string[] = [];
    if (state.surveyModel === undefined) return sectionsNames;
    state.surveyModel.pages.forEach(page => {
      if (page.name.includes(payload)) {
        sectionsNames.push(page.name);
      }
    });
    return sectionsNames;
  },
  // Should use mapstate instead
  returnToolData(state: RootState) {
    let allResults = [];
    if (state.toolData === undefined) return {};
    allResults = state.toolData;
    return allResults;
  },
  //Logic is useless, it's either defined or not at state level, should use mapstate instead
  returnSurveyModel(state: RootState) {
    if (state.surveyModel === undefined) {
      return undefined;
    } else {
      return state.surveyModel;
    }
  },
  // Should use mapstate instead
  returnCurrentPageNumber(state: RootState) {
    return state.currentPageNo;
  },
  // Should use mapstate instead
  returnSections(state: RootState) {
    return state.sections;
  },
  // Should use mapstate instead
  returnDisplayWelcome(state: RootState) {
    return state.displayWelcomeNotice;
  },
  returnSectionPrefix(state: RootState) {
    return state.sectionsPrefix;
  }
};
