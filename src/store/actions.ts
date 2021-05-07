import { ActionTree, ActionContext } from "vuex";
import { Mutations, MutationType } from "@/store/mutations";
import { RootState, Section, state } from "@/store/state";
import appConfig from "@/survey-results.json";
import appData from "@/survey-enfr.json";
import { PageModel, Model, SurveyModel } from "survey-vue";
import { store } from "@/store/index";
import { getters } from "@/store/getters";
import isEmpty from "lodash.isempty";

const appConfigSettings = appConfig.settings;
const recommendations = appConfig;
//const performance = appConfig.performance;

export enum ActionTypes {
  FetchAppData = "FETCH_APP_DATA",
  GetLocalAppData = "GET_LOCAL_APP_DATA",
  SetAppData = "SET_APP_DATA",
  SaveAppData = "SAVE_APP_DATA",
  SetSections = "SET_SECTIONS",
  SetCurrentSection = "SET_CURRENT_SECTION",
  UpdateSectionAnswers = "UPDATE_SECTION_ANSWERS",
  UpdateSectionScore = "UPDATE_SECTION_SCORE",
  // ---------------
  //Actions below are to help transition to new store structure
  // ---------------
  /**
   * Action to update the Survey Data
   * @param
   */
  UpdateSurveyData = "UPDATE_SURVEY_DATA",
  UpdateDisplayNotice = "UPDATE_DISPLAY_NOTICE",
  UpdateCurrentPageName = "UPDATE_CURRENT_PAGE_NAME"
}

type ActionAugments = Omit<ActionContext<RootState, RootState>, "commit"> & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
};

export type Actions = {
  [ActionTypes.FetchAppData](context: ActionAugments, value: string): void;
  [ActionTypes.GetLocalAppData](context: ActionAugments): void;
  [ActionTypes.SetAppData](context: ActionAugments): void;
  [ActionTypes.SaveAppData](context: ActionAugments, value: SurveyModel): void;
  [ActionTypes.SetSections](context: ActionAugments, value: SurveyModel): void;
  [ActionTypes.SetCurrentSection](
    context: ActionAugments,
    value: { sectionNo: number; sectionPageName: string }
  ): void;
  [ActionTypes.UpdateSectionAnswers](
    context: ActionAugments,
    value: { answerData: any[]; toolData: any }
  ): void;
  [ActionTypes.UpdateSectionScore](
    context: ActionAugments,
    value: PageModel
  ): void;
  // ---------------
  //Actions below are to help transition to new store structure
  // ---------------
  [ActionTypes.UpdateSurveyData](
    context: ActionAugments,
    value: SurveyModel
  ): void;
  [ActionTypes.UpdateDisplayNotice](
    context: ActionAugments,
    value: boolean
  ): void;
  [ActionTypes.UpdateCurrentPageName](
    context: ActionAugments,
    value: string
  ): void;
};

export const actions: ActionTree<RootState, RootState> & Actions = {
  async [ActionTypes.FetchAppData]({ commit }, value) {
    commit(MutationType.StartLoading, undefined);
    let remoteAppData: Model;
    fetch(value)
      .then(response => response.json()) // one extra step
      .then(data => {
        remoteAppData = new Model(data);
        if (remoteAppData) {
          commit(MutationType.SetSurveyModel, remoteAppData);
          commit(MutationType.AppLoadingSuccess, undefined);
        } else {
          commit(MutationType.AppLoadingError, undefined);
        }
      })
      .catch(error => console.error(error));
    commit(MutationType.StopLoading, undefined);
  },
  async [ActionTypes.GetLocalAppData]({ commit }) {
    commit(MutationType.StartLoading, undefined);
    const localAppData: Model = new Model(appData);
    if (localAppData) {
      commit(MutationType.AppLoadingSuccess, undefined);
    } else {
      commit(MutationType.AppLoadingError, undefined);
    }
    commit(MutationType.StopLoading, undefined);
  },
  async [ActionTypes.SetAppData]({ commit, getters }) {
    commit(MutationType.StartLoading, undefined);
    if (getters.isStateError === false) {
      commit(MutationType.SetCurrentPageNo, 0);
      commit(MutationType.SetCurrentPageName, "");
      let sectionsNames: string[] = getters.returnSectionsNames;
      commit(MutationType.SetSectionsNames, sectionsNames);
      let toolData: any = getters.returnToolData;
      commit(MutationType.SetToolData, toolData);
      commit(MutationType.SetRecommendations, recommendations);
      commit(MutationType.SetToolVersion, appConfigSettings.version);
      commit(MutationType.SetSectionsPrefix, appConfigSettings.sectionsPrefix);
      commit(MutationType.Initialize, undefined);
    }
    commit(MutationType.StopLoading, undefined);
  },
  async [ActionTypes.SaveAppData]({ commit, dispatch }, value: SurveyModel) {
    commit(MutationType.StartLoading, undefined);
    commit(MutationType.SetAnswerData, value.getPlainData());
    commit(MutationType.SetToolData, value.data);
    commit(MutationType.StopLoading, undefined);
  },
  async [ActionTypes.SetSections]({ commit, getters }, value: SurveyModel) {
    let sections: Section[] = [];
    if (getters.returnSectionsNames.length > 0) {
      const sectionNames: string[] = getters.returnSectionsNames;
      sectionNames.forEach(sectionName => {
        let newSection: Section = {
          sectionName: sectionName,
          enabled: false,
          completed: false,
          questionsNames: [],
          userScore: 0,
          maxScore: (value.getPageByName(sectionName).questions.length - 1) * 7,
          questions: []
        };
        value.getPageByName(sectionName).questions.forEach(question => {
          newSection.questionsNames.push(question.name);
          newSection.questions.push(question);
        });
        sections.push(newSection);
      });
      commit(MutationType.SetSections, sections);
    }
  },
  async [ActionTypes.SetCurrentSection](
    { commit },
    value: { sectionNo: number; sectionPageName: string }
  ) {
    commit(MutationType.SetCurrentPageNo, value.sectionNo);
    commit(MutationType.SetCurrentPageName, value.sectionPageName);
  },
  async [ActionTypes.UpdateSectionAnswers](
    { commit },
    value: { answerData: any[]; toolData: any }
  ) {
    commit(MutationType.SetAnswerData, value.answerData);
    commit(MutationType.SetToolData, value.toolData);
  },
  async [ActionTypes.UpdateSectionScore]({ commit }, value: PageModel) {
    let thisA: string;
  },
  // ---------------
  //Actions below are to help transition to new store structure
  // ---------------
  async [ActionTypes.UpdateSurveyData](
    { commit, dispatch },
    value: SurveyModel
  ) {
    commit(MutationType.SetSurveyModel, value);
    commit(MutationType.SetCurrentPageNo, value.currentPageNo);
    commit(MutationType.SetRecommendations, appConfig);
    console.log(isEmpty(state.sectionsNames));
    if (isEmpty(state.sectionsNames)) {
      let sectionNames: string[];
      sectionNames = getters.returnSectionsNamesGenerated(state);
      commit(MutationType.SetSectionsNames, sectionNames);
    }
    if (isEmpty(state.sections)) {
      dispatch(ActionTypes.SetSections, value);
    }
    dispatch(ActionTypes.UpdateSectionScore);
    commit(MutationType.SetToolData, value.data);
    commit(MutationType.SetDisplayNoticeStatus, state.displayWelcomeNotice);
    commit(
      MutationType.SetAnswerData,
      value.getPlainData({ includeEmpty: false })
    );
  },
  async [ActionTypes.UpdateDisplayNotice]({ commit }, value: boolean) {
    commit(MutationType.SetDisplayNoticeStatus, value);
  },
  async [ActionTypes.UpdateCurrentPageName]({ commit }, value: string) {
    if (value.length > 0) {
      commit(MutationType.SetCurrentPageName, value);
    }
  }
};
