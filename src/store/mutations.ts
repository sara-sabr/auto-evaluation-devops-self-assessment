import { MutationTree } from "vuex";
import { Recommendations, RootState, Section } from "@/store/state";
import { SurveyModel } from "survey-vue";

export enum MutationType {
  /**
   * Sets app loading error status as ```false``` if successfully loaded app data
   * @param undefined
   */
  AppLoadingSuccess = "APP_LOADING_SUCCESS",
  /**
   * Sets app loading error status as ```true``` if successfully loaded app data
   * @param undefined
   */
  AppLoadingError = "APP_LOADING_ERROR",
  /**
   * Sets ```state.surveyModel``` with value
   * @param value Contains a ```SurveyModel``` object
   */
  SetSurveyModel = "SET_SURVEY_MODEL",
  /**Sets ```state.answerData``` with value
   * @param value Contains ```any[]```
   */
  SetAnswerData = "SET_ANSWER_DATA",
  /**Sets ```state.toolData``` with value
   * @param value Contains ```any```
   */
  SetToolData = "SET_TOOL_DATA",
  /**Sets ```state.sections``` with value
   * @param value Contains ```Section``` array
   */
  SetSections = "SET_SECTIONS",
  /**Sets ```state.sectionsNames``` with value
   * @param value Contains ```string``` array
   */
  SetSectionsNames = "SET_SECTIONS_NAMES",
  /**Sets ```state.currentPageNo``` with value
   * @param value Contains ```number```
   */
  SetCurrentPageNo = "SET_CURRENT_PAGE_NO",
  /**Sets ```state.currentPageName``` with value
   * @param value Contains ```string```
   */
  SetCurrentPageName = "SET_CURRENT_PAGE_NAME",
  /**Sets ```state.recommendations``` with value
   * @param value Contains ```string```
   */
  SetRecommendations = "SET_RECOMMENDATIONS",
  /**Sets ```state.toolVersion``` with value
   * @param value Contains ```Recommendations``` object
   */
  SetToolVersion = "SET_TOOL_VERSION",
  /**Sets ```state.sectionsPrefix``` with value
   * @param value Contains ```string```
   */
  SetSectionsPrefix = "SET_SECTIONS_PREFIX",
  /**Sets ```state.loading``` to ```true```
   * @param value Contains ```undefined```
   */
  StartLoading = "START_LOADING",
  /**Sets ```state.loading``` to ```false```
   * @param value Contains ```undefined```
   */
  StopLoading = "STOP_LOADING",
  /**Sets ```state.initialized``` to ```true```
   * @param value Contains ```undefined```
   */
  Initialize = "INITIALIZE"
}

export type Mutations = {
  [MutationType.AppLoadingSuccess](state: RootState): void;
  [MutationType.AppLoadingError](state: RootState): void;
  [MutationType.SetSurveyModel](state: RootState, value: SurveyModel): void;
  [MutationType.SetAnswerData](state: RootState, value: any[]): void;
  [MutationType.SetToolData](state: RootState, value: any): void;
  [MutationType.SetSections](state: RootState, value: Section[]): void;
  [MutationType.SetSectionsNames](state: RootState, value: string[]): void;
  [MutationType.SetCurrentPageNo](state: RootState, value: number): void;
  [MutationType.SetCurrentPageName](state: RootState, value: string): void;
  // TODO: Need to fix State structure to simplify Recommendations
  [MutationType.SetRecommendations](
    state: RootState,
    value: Recommendations
  ): void;
  [MutationType.SetToolVersion](state: RootState, value: string): void;
  [MutationType.SetSectionsPrefix](state: RootState, value: string): void;
  [MutationType.StartLoading](state: RootState): void;
  [MutationType.StopLoading](state: RootState): void;
  [MutationType.Initialize](state: RootState): void;
};

export const mutations: MutationTree<RootState> & Mutations = {
  [MutationType.AppLoadingSuccess](state: RootState) {
    state.error = false;
  },
  [MutationType.AppLoadingError](state: RootState) {
    state.error = true;
  },
  [MutationType.SetSurveyModel](state: RootState, value: SurveyModel) {
    state.surveyModel = value;
  },
  [MutationType.SetAnswerData](state: RootState, value: any[]) {
    state.answerData = value;
  },
  [MutationType.SetToolData](state: RootState, value: any) {
    state.toolData = Object.freeze(value);
  },
  [MutationType.SetSectionsNames](state: RootState, value: string[]) {
    state.sectionsNames = value;
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
  [MutationType.StartLoading](state: RootState) {
    state.loading = true;
  },
  [MutationType.StopLoading](state: RootState) {
    state.loading = false;
  },
  [MutationType.Initialize](state: RootState) {
    state.initialized = true;
  }
};
