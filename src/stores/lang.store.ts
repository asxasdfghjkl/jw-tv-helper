import { ILangObj } from "@/objs/ILangObj";
import Vue from "vue";

declare interface ILangStoreObj {
  langs: ILangObj[];
}

export const STORE_KEY: string = "tv-helper-langs";
const store: ILangStoreObj = Vue.observable({ langs: JSON.parse(localStorage[STORE_KEY] || "[]") });
export default store;