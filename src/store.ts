/* eslint-disable security/detect-object-injection */
import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import VuexPersistence from "vuex-persist";
import { RootState, Section } from "./types";
import {
  IQuestion,
  SurveyModel,
  LocalizableString,
  PageModel
} from "survey-vue";
import isEmpty from "lodash.isempty";
import sectionsRecommendations from "./survey-results.json";
import { filter } from "vue/types/umd";
import { stat } from "fs";
import { STATUS_CODES } from "http";
//import { strict } from "assert";

Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state: RootState) => ({
    toolData: state.toolData,
    currentPageNo: state.currentPageNo,
    currentPageName: state.currentPageName,
    displayWelcomeNotice: state.displayWelcomeNotice
  })
});

/**
 * Helper function listing all sections based on surveyData
 * @param state An object containing the state of the survey.
 * @param surveyData An object containing the survey data.
 */
const determineAllSections = (state: RootState, surveyData: SurveyModel) => {
  let allSections: string[];
  let pages = surveyData.pages;
  allSections = [];
  pages.forEach(page => {
    if (page.name.includes("section_")) {
      allSections.push(page.name);
    }
  });
  state.sectionsNames = allSections;
};

/**
 * Helper function generating the state Sections based on the Survey data.
 * @param surveyData An object containing the survey data.
 */
const initializeSections = (state: RootState, surveyData: SurveyModel) => {
  state.sectionsNames.forEach(sectionName => {
    const newSection: Section = {
      sectionName: sectionName,
      enabled: false,
      completed: false,
      questionsNames: [],
      userScore: 0,
      maxScore:
        (surveyData.getPageByName(sectionName).questions.length - 1) * 7,
      questions: []
    };
    surveyData.getPageByName(sectionName).questions.forEach(question => {
      newSection.questionsNames.push(question.name);
      newSection.questions.push(question);
    });
    state.sections.push(newSection);
  });
};

// /**
//  * Helper function which determining enabled sections based on surveyData.
//  * @param state An object containing the state of the survey.
//  * @param surveyData An object containing the survey data.
//  */
// const determineSectionsEnabled = (
//   state: RootState,
//   surveyData: SurveyModel
// ) => {
//   if (isEmpty(state.sectionsNames)) {
//     determineAllSections(state, surveyData);
//   }
//   state.sectionsEnabled = state.sectionsNames;
// };

/**
 * Function returning the localized strings of a Survey.js Panel object.
 * @param panel A Survey.js panel object.
 */
export const getLocalizedSurveyString = (panel: any) => {
  let localizedString = {
    en: panel.locTitle.getLocaleText("default"),
    fr: panel.locTitle.getLocaleText("fr")
  };
  return localizedString;
};

/**
 * Helper function updating the store data based on the survey data.
 * @param state An object containing the state of the survey.
 * @param surveyData An object containing the survey data.
 */
const updateSurveyData = (state: RootState, surveyData: SurveyModel) => {
  state.surveyModel = surveyData;
  state.currentPageNo = surveyData.currentPageNo;
  state.recommendations! = sectionsRecommendations;
  if (isEmpty(state.sectionsNames)) {
    determineAllSections(state, surveyData);
  }
  if (isEmpty(state.sections)) {
    initializeSections(state, surveyData);
  }
  updateSectionsScores(state, surveyData);

  //freeze this data so we can load from localStorage
  state.toolData = Object.freeze(surveyData.data);
  state.displayWelcomeNotice = Object.freeze(state.displayWelcomeNotice);
  state.answerData = surveyData.getPlainData({
    includeEmpty: false
  });
};

/**
 * Helper function to enable a section
 * @param state An object containing the state of the survey.
 * @param sectionName A string containing the section name.
 */

const enableSection = (state: RootState, sectionName: string) => {
  let indexSections = state.sections.findIndex(
    section => section.sectionName === sectionName
  );
  if (state.surveyModel !== undefined && indexSections !== -1) {
    state.sections[indexSections].enabled = true;
    state.surveyModel.getPageByName(sectionName).visible = true;
  } else {
    throw new Error("Section name does not exist");
  }
};

/**
 * Helper function hiding all sections except the one passed as a parameter
 * @param state An object containing the state of the survey.
 * @param sectionName A string containing the section name.
 */
const hideOtherSections = (
  state: RootState,
  surveyData: SurveyModel,
  sectionName: string
) => {
  let pages = surveyData.pages;
  if (pages !== undefined) {
    pages.forEach(page => {
      if (page.name !== sectionName && page.isVisible === true) {
        page.visible = false;
      }
    });
  } else {
    throw new Error("Section already hidden");
  }
};

/**
 * Helper function to return all Survey sections based on a defined prefix
 * @param surveyData An object containing the survey data.
 * @param prefix A string containing the prefix
 */
export function returnAllSectionsByPrefix(
  surveyData: SurveyModel,
  prefix: string
): PageModel[] {
  let sections: PageModel[] = [];
  surveyData.pages.forEach(page => {
    if (page.name.includes(prefix)) {
      sections.push(page);
    }
  });
  return sections;
}

/**
 * Helper function validating if the question has a score.
 * @param question A question object to evaluate
 * @returns A boolean value.
 */
function hasScore(question: IQuestion): boolean {
  if (question.getType() === "boolean" || question.getType() === "rating") {
    return true;
  }
  return false;
}

/**
 * Helper function calculating the user score of a specific section.
 * @param surveyData An object containing the survey data.
 * @param sectionName A string containing the section name.
 * @returns A number containing the user score.
 */
const calculateSectionScore = (
  surveyData: SurveyModel,
  sectionName: string
) => {
  let sectionScore: number = 0;
  let page = surveyData.getPageByName(sectionName);
  page.questions.forEach(question => {
    if (question.value !== undefined) {
      let score: number = +question.value;
      sectionScore += score;
    }
  });
  return sectionScore;
};

/**
 * Helper function updating state section score based on user data.
 * @param state An object containing the state of the survey.
 * @param surveyData An object containing the survey data.
 * @param sectionName A string containing the section name.
 */
const updateSectionsScores = (state: RootState, surveyData: SurveyModel) => {
  state.sections.forEach(section => {
    section.userScore = calculateSectionScore(surveyData, section.sectionName);
    if (section.userScore != 0 && section.enabled == false) {
      section.enabled = true;
    }
  });
};

const updateCurrentPageNo = (state: RootState, currentPageNo: number) => {
  if (currentPageNo >= 0 && currentPageNo < state.sections.length) {
    state.currentPageNo = currentPageNo;
  }
};

const updateCurrentPageName = (state: RootState, currentPageName: string) => {
  if (currentPageName.length > 0) {
    state.currentPageName = currentPageName;
  }
};

const store: StoreOptions<RootState> = {
  plugins: [vuexLocal.plugin],
  state: {
    sections: [],
    sectionsNames: [],
    // sectionsAllEnabled: false,
    // sectionsEnabled: [],
    answerData: [],
    surveyModel: undefined,
    toolData: undefined,
    currentPageNo: 0,
    currentPageName: undefined,
    recommendations: undefined,
    toolVersion: sectionsRecommendations.settings.version,
    displayWelcomeNotice: true,
    sectionsPrefix: "",
    error: false,
    loading: false,
    initialized: false
  },
  mutations: {
    // Disabled resetSurvey mutation
    // mutation to reset the state when a user resets the survey
    // resetSurvey(state: RootState) {
    //   state.sections = [];
    //   state.answerData = [];
    //   state.sectionsNames = [];
    //   // state.sectionsAllEnabled = true;
    //   // state.sectionsEnabled = [];
    //   state.surveyModel = undefined;
    //   state.currentPageNo = 0;
    //   state.currentPageName = undefined;
    //   state.toolData = {};
    //   state.recommendations = undefined;
    //   state.displayWelcomeNotice = true;
    // },

    // update state with results from survey
    // every time a value has changed or survey completed
    updateSurveyData(state: RootState, result: SurveyModel) {
      updateSurveyData(state, result);
      //TODO: reintroduce toggleButton(state) - was not ported over from AIA
      //toggleButton(state);
    },

    calculateResult(state: RootState, result: SurveyModel) {
      updateSurveyData(state, result);
    },

    moveInSection(state: RootState, result: SurveyModel) {
      //enableSection(state);
      //hideOtherSections(state, result);
    },

    updateCurrentPageNo(state: RootState, currentPageNo: number) {
      updateCurrentPageNo(state, currentPageNo);
    },
    updateCurrentPageName(state: RootState, currentPageName: string) {
      updateCurrentPageName(state, currentPageName);
    },
    updateDisplayNotice(state: RootState, displayWelcomeNotice: boolean) {
      state.displayWelcomeNotice = displayWelcomeNotice;
    },

    initializeSections(state: RootState, result: SurveyModel) {
      initializeSections(state, result);
    }
  },
  getters: {
    //Need to update progress status based on completed sections.
    inProgress: state => {
      return !isEmpty(state.toolData);
    },
    returnSectionsNamesGenerated: state => {
      let sectionsNames: string[] = [];
      if (state.surveyModel === undefined) return {};
      state.surveyModel.pages.forEach(page => {
        if (page.name.includes("section_")) {
          sectionsNames.push(page.name);
        }
      });
      if (sectionsNames.length === 0) {
        return undefined;
      } else return sectionsNames;
    },
    returnSectionByName: state => (sectionName: string) => {
      return state.sections.find(section => {
        return section.sectionName === sectionName;
      });
    },
    returnCurrentSection: state => {
      return state.sections.find(section => {
        return section.sectionName === state.currentPageName;
      });
    },
    resultsDataSections: state => {
      let allResults = [];
      if (state.toolData === undefined) return {};
      allResults = state.toolData;
      return allResults;
    },
    returnAllQuestions: state => {
      return state.sectionsNames;
    },
    returnSections: state => {
      return state.sections;
    },
    returnSurveyModel: state => {
      if (state.surveyModel == undefined) {
        return undefined;
      } else {
        return state.surveyModel;
      }
    },
    returnCurrentPageNumber: state => {
      return state.currentPageNo;
    },
    returnDisplayWelcome: state => {
      return state.displayWelcomeNotice;
    }
  }
};

export default new Vuex.Store<RootState>(store);
