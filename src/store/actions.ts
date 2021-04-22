import { ActionTree, ActionContext } from "vuex";
import { Mutations, MutationType } from "@/store/mutations";
import { RootState } from "@/types";
import appConfig from "@/survey-results.json";
import appData from "@/survey-enfr.json";

const appConfigs = appConfig.settings;
const recommendations = appConfig.sectionRecommendations;

export enum ActionTypes {
  GetAppData = "GET_APP_DATA",
  SetAppData = "SET_APP_DATA"
}

type ActionAugments = Omit<ActionContext<RootState, RootState>, "commit"> & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
};

export type Actions = {
  [ActionTypes.GetAppData](context: ActionAugments): void;
  [ActionTypes.SetAppData](context: ActionAugments): void;
};

export const actions: ActionTree<RootState, RootState> & Actions = {
  async [ActionTypes.GetAppData]({ commit }) {
    commit(MutationType.SetLoading, true);
  },
  async [ActionTypes.SetAppData]({ commit }) {
    commit(MutationType.SetLoading, true);
  }
};
