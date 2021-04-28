import { ActionTree, ActionContext } from "vuex";
import { Mutations, MutationType } from "@/store/mutations";
import { RootState, Section, state } from "@/store/state";
import appConfig from "@/survey-results.json";
import appData from "@/survey-enfr.json";
import { Model, SurveyModel } from "survey-vue";
import store from "@/store/index";
import { getters } from "./getters";

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
    commit(MutationType.SetLoading, true);
    let remoteAppData: Model;
    fetch(value)
      .then(response => response.json()) // one extra step
      .then(data => {
        remoteAppData = new Model(data);
        if (remoteAppData) {
          commit(MutationType.SetSurveyData, remoteAppData);
        } else {
          commit(MutationType.AppError, undefined);
        }
      })
      .catch(error => console.error(error));
    commit(MutationType.SetLoading, false);
  },
  async [ActionTypes.GetLocalAppData]({ commit }) {
    commit(MutationType.SetLoading, true);
    let survey: Model = new Model(appData);
    if (survey) {
      commit(MutationType.SetSurveyData, survey);
    } else {
      commit(MutationType.AppError, undefined);
    }
    commit(MutationType.SetLoading, false);
  },
  async [ActionTypes.SetAppData]({ commit, dispatch }) {
    commit(MutationType.SetLoading, true);
    console.log(store.state.error);
    if (store.state.error === false) {
      // const surveyData = store.state.surveyModel as SurveyModel;
      commit(MutationType.SetCurrentPageNo, 0);
      commit(MutationType.SetCurrentPageName, "");
      let sectionsNames: string[] = getters.returnSectionsNames(state);
      commit(MutationType.SetSectionsNames, sectionsNames);
      dispatch(ActionTypes.SetSections, store.state.surveyModel);
      commit(MutationType.SetRecommendations, recommendations);
      commit(MutationType.SetToolVersion, appConfigs.version);
      commit(MutationType.SetSectionsPrefix, appConfigs.sectionsPrefix);
    }
    commit(MutationType.SetLoading, false);
  },
  async [ActionTypes.SaveAppData]({ commit, dispatch }, value: SurveyModel) {
    commit(MutationType.SetLoading, true);
    commit(
      MutationType.SetAnswerData,
      value.getPlainData({ includeEmpty: false })
    );
    commit(MutationType.SetCurrentPageNo, value.currentPageNo);
    commit(MutationType.SetToolData, value.data);
    // TODO: Review setup of sections scores based on state
    state.sections.forEach(section => {
      let sectionScore: number = 0;
      let page = value.getPageByName(section.sectionName);
      page.questions.forEach(question => {
        if (question.value !== undefined) {
          let score: number = +question.value;
          sectionScore += score;
        }
      });
      // commit(MutationType.se)
      section.userScore = sectionScore;
    });
    dispatch(ActionTypes.SetSections, value);
    commit(MutationType.SetLoading, false);
  },
  async [ActionTypes.SetSections]({ commit }, value: SurveyModel) {
    let sections: Section[] = [];
    if (state.sectionsNames.length > 0) {
      state.sectionsNames.forEach(sectionName => {
        let newSection: Section = {
          sectionName: sectionName,
          enabled: false,
          completed: false,
          questionsNames: [],
          userScore: 0,
          maxScore:
            (store.getters.getPageByName(sectionName).questions.length - 1) * 7,
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
