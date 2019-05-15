<template>
  <div class="modal fade show d-block backdrop">
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Language Config</h5>
        </div>
        <div class="modal-body container">
          <div class="row">
            <div class="col-12 col-md-6">
              <div class="card">
                <div class="card-header">Selected Languages</div>
                <ul class="list-group list-group-flush">
                  <li
                    v-for="l in langs"
                    :key="l.code"
                    class="list-group-item d-flex justify-content-between"
                  >{{l.name}}
                    <div class="d-flex align-items-center">
                      <div
                        class="btn btn-light material-icons rounded-pill p-1"
                        @click="onRemoveLang(l)"
                      >close</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <span class="material-icons">search</span>
                  </div>
                </div>
                <input
                  v-model="filter"
                  class="form-control"
                >
              </div>
              <ul class="list-group">
                <li
                  v-for="l in langOptions"
                  :key="l.code"
                  class="list-group-item list-group-item-action pointer"
                  @click="onAddLang(l)"
                >
                  <div class="font-weight-bold">{{l.name}}</div>
                  {{l.enName}}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div
            class="btn btn-primary"
            @click="$emit('result')"
          >OK</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { ILangObj } from "@/objs/ILangObj";
import langStore, { STORE_KEY } from "@/stores/lang.store";
import Axios from "axios";

declare interface IAllLangObj extends ILangObj {
  search: string;
  enName: string;
}

let allLangs: IAllLangObj[];

@Component({
  name: "LanguageModal"
})
export default class LanguageModal extends Vue {
  get langs(): ILangObj[] {
    return langStore.langs;
  }
  set langs(value: ILangObj[]) {
    langStore.langs = [...value];
    localStorage[STORE_KEY] = JSON.stringify(value);
  }

  allLangs: IAllLangObj[] | null = null;
  filter: string = "";

  get filterdSelected(): IAllLangObj[] {
    const langCodes: string[] = this.langs.map(l => l.code);
    if (this.allLangs) {
      const d: any = this.allLangs.filter(al => !langCodes.includes(al.code));
      return d;
    }
    return [];
  }

  get langOptions(): IAllLangObj[] {
    return this.filterdSelected.filter(l => l.search.includes(this.filter));
  }

  onAddLang(lang: ILangObj): void {
    this.langs = [...this.langs, lang];
  }

  onRemoveLang(lang: ILangObj): void {
    this.langs = this.langs.filter(l => l !== lang);
  }

  mounted(): void {
    if (allLangs) {
      this.allLangs = allLangs;
    } else {
      Axios.get("https://data.jw-api.org/mediator/v1/languages/E/web?clientType=tvjworg").then(response => {
        const options: IAllLangObj[] = response.data.languages.map((l: any) => ({
          code: l.code,
          name: l.vernacular,
          enName: l.name,
          search: `${l.vernacular} ${l.name}`.toLowerCase()
        }));
        allLangs = options;
        this.allLangs = options;
      });
    }
  }
}
</script>
