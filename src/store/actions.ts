import { ActionTree, ActionContext } from "vuex";
import { Mutations, MutationType } from "@/store/mutations";
import { RootState } from "@/store/state";
import appConfig from "@/survey-results.json";
import appData from "@/survey-enfr.json";
import { Model, SurveyModel } from "survey-vue";
import store from "@/store";

const appConfigs = appConfig.settings;
const recommendations = appConfig;
//const performance = appConfig.performance;

export enum ActionTypes {
  FetchAppData = "FETCH_APP_DATA",
  GetLocalAppData = "GET_APP_DATA",
  SetAppData = "SET_APP_DATA",
  SaveAppData = "SAVE_APP_DATA"
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
  async [ActionTypes.SetAppData]({ commit }) {
    commit(MutationType.SetLoading, true);
    if (store.state.error === false) {
      const surveyData = store.state.surveyModel as SurveyModel;
      commit(MutationType.SetCurrentPageNo, 0);
      commit(MutationType.SetCurrentPageName, "");
      commit(MutationType.SetRecommendations, recommendations);
      commit(MutationType.SetToolVersion, appConfigs.version);
      commit(MutationType.SetSectionsPrefix, appConfigs.sectionsPrefix);
    }
    commit(MutationType.SetLoading, false);
  },
  // TODO: Complete action of saving app data (see store current steps)
  async [ActionTypes.SaveAppData]({ commit }, value: SurveyModel) {
    commit(MutationType.SetAnswerData, value.getPlainData);
  }
};
