import { ActionTree, ActionContext } from "vuex";
import { Mutations, MutationType } from "@/store/mutations";
import { RootState, Section, state } from "@/store/state";
import appConfig from "@/survey-results.json";
import appData from "@/survey-enfr.json";
import { Model, SurveyModel } from "survey-vue";
import { store } from "@/store/index";
import { getters } from "@/store/getters";

const appConfigs = appConfig.settings;
const recommendations = appConfig;
//const performance = appConfig.performance;

export enum ActionTypes {
  FetchAppData = "FETCH_APP_DATA",
  GetLocalAppData = "GET_APP_DATA",
  SetAppData = "SET_APP_DATA",
  SaveAppData = "SAVE_APP_DATA",
  SetSections = "SET_SECTIONS"
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
          commit(MutationType.SetSurveyData, remoteAppData);
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
    let localAppData: Model = new Model(appData);
    if (localAppData) {
      commit(MutationType.SetSurveyData, localAppData);
      commit(MutationType.AppLoadingSuccess, undefined);
    } else {
      commit(MutationType.AppLoadingError, undefined);
    }
    commit(MutationType.StopLoading, undefined);
  },
  async [ActionTypes.SetAppData]({ commit, dispatch, getters }) {
    commit(MutationType.StartLoading, undefined);
    if (getters.isStateError === false) {
      // const surveyData = store.state.surveyModel as SurveyModel;
      commit(MutationType.SetCurrentPageNo, 0);
      commit(MutationType.SetCurrentPageName, "");
      let sectionsNames: string[] = getters.returnSectionsNames;
      let surveyModel: SurveyModel = getters.returnSurveyModel;
      commit(MutationType.SetSectionsNames, sectionsNames);
      // dispatch(ActionTypes.SetSections, surveyModel);
      commit(MutationType.SetRecommendations, recommendations);
      commit(MutationType.SetToolVersion, appConfigs.version);
      commit(MutationType.SetSectionsPrefix, appConfigs.sectionsPrefix);
    }
    commit(MutationType.StopLoading, undefined);
  },
  async [ActionTypes.SaveAppData]({ commit, dispatch }, value: SurveyModel) {
    commit(MutationType.StartLoading, undefined);
    commit(
      MutationType.SetAnswerData,
      value.getPlainData({ includeEmpty: false })
    );
    commit(MutationType.SetCurrentPageNo, value.currentPageNo);
    commit(MutationType.SetToolData, value.data);
    // TODO: Review setup of sections scores based on state
    // state.sections.forEach(section => {
    //   let sectionScore: number = 0;
    //   let page = value.getPageByName(section.sectionName);
    //   page.questions.forEach(question => {
    //     if (question.value !== undefined) {
    //       let score: number = +question.value;
    //       sectionScore += score;
    //     }
    //   });
    //   // commit(MutationType.se)
    //   section.userScore = sectionScore;
    // });
    // dispatch(ActionTypes.SetSections, value);
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
  }
};
