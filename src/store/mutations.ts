import { MutationTree } from "vuex";
import { Recommendations, RootState, Section } from "@/types";
import { SurveyModel } from "survey-vue";

export enum MutationType {
  AppLoaded = "APP_LOADED",
  AppError = "APP_ERROR",
  SetSurveyData = "SET_SURVEY_DATA",
  SetAnswerData = "SET_ANSWER_DATA",
  SetToolData = "SET_TOOL_DATA",
  SetSections = "SET_SECTIONS",
  SetSectionsNames = "SET_SECTIONS_NAMES",
  SetCurrentPageNo = "SET_CURRENT_PAGE_NO",
  SetCurrentPageName = "SET_CURRENT_PAGE_NAME",
  SetRecommendations = "SET_RECOMMENDATIONS",
  SetToolVersion = "SET_TOOL_VERSION",
  SetSectionsPrefix = "SET_SECTIONS_PREFIX",
  SetLoading = "SET_LOADING"
}

export type Mutations = {
  [MutationType.AppLoaded](state: RootState, value: SurveyModel): void;
  [MutationType.AppError](state: RootState): void;
  [MutationType.SetSurveyData](state: RootState, value: SurveyModel): void;
  [MutationType.SetAnswerData](state: RootState, value: any): void;
  [MutationType.SetSections](state: RootState, value: Section[]): void;
  [MutationType.SetCurrentPageNo](state: RootState, value: number): void;
  [MutationType.SetCurrentPageName](state: RootState, value: string): void;
  [MutationType.SetRecommendations](
    state: RootState,
    value: Recommendations
  ): void;
  [MutationType.SetToolVersion](state: RootState, value: string): void;
  [MutationType.SetSectionsPrefix](state: RootState, value: string): void;
  [MutationType.SetLoading](state: RootState, value: boolean): void;
};

export const mutations: MutationTree<RootState> & Mutations = {
  [MutationType.AppLoaded](state: RootState, value: SurveyModel) {
    state.surveyModel = value;
    state.answerData = [];
    state.toolData = undefined;
    state.sections = [];
    state.sectionsNames = [];
    state.currentPageNo = 0;
    state.currentPageName = undefined;
    state.recommendations = undefined;
    state.toolVersion = "";
    state.sectionsPrefix = "";
    state.error = false;
  },
  [MutationType.AppError](state: RootState) {
    state.surveyModel = undefined;
    state.answerData = [];
    state.toolData = undefined;
    state.sections = [];
    state.sectionsNames = [];
    state.currentPageNo = 0;
    state.currentPageName = undefined;
    state.recommendations = undefined;
    state.toolVersion = "";
    state.sectionsPrefix = "";
    state.error = true;
  },
  [MutationType.SetSurveyData](state: RootState, value: SurveyModel) {
    state.surveyModel = value;
  },
  [MutationType.SetAnswerData](state: RootState, value: any) {
    state.answerData = value;
  },
  [MutationType.SetSections](state: RootState, value: Section[]) {
    state.sections = value;
  },
  [MutationType.SetCurrentPageNo](state: RootState, value: number) {
    state.currentPageNo = value;
  },
  [MutationType.SetCurrentPageName](state: RootState, value: string) {
    state.currentPageName = value;
  },
  [MutationType.SetRecommendations](state: RootState, value: Recommendations) {
    state.recommendations = value;
  },
  [MutationType.SetToolVersion](state: RootState, value: string) {
    state.toolVersion = value;
  },
  [MutationType.SetSectionsPrefix](state: RootState, value: string) {
    state.sectionsPrefix = value;
  },
  [MutationType.SetLoading](state: RootState, value: boolean) {
    state.loading = value;
  }
};
