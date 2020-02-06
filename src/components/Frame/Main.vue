<template>
  <div class="flex-grow-1 p-3 overflow-auto">
    <div class="container">
      <ul class="nav nav-tabs">
        <li
          class="nav-item"
          @click="tab='download'"
        >
          <span :class="['nav-link d-inline-flex pointer', { active: tab === 'download' }]">
            <span class="material-icons">save_alt</span>
            Download
          </span>
        </li>
        <li
          class="nav-item"
          @click="tab='play'"
        >
          <span :class="['nav-link d-inline-flex pointer', { active: tab === 'play' }]">
            <span class="material-icons">play_arrow</span>
            Play
          </span>
        </li>
      </ul>
      <div
        class="tab-content p-3"
        style="border: 1px solid rgba(0, 0, 0, 0.125);border-top-color: transparent;"
      >
        <keep-alive>
          <component
            :is="tabComponent"
            :langs="langs"
            :videoInfos="videoInfos"
          />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop, Watch } from "vue-property-decorator";
import DownloadTab from "@/components/DownloadTab.vue";
import PlayTab from "@/components/PlayTab.vue";
import { ILangObj } from "@/objs/ILangObj";
import langStore from "@/stores/lang.store";
import { PageParser } from '@/PageParsers/PageParser';
import { ParsedInfoObj } from '../../objs/ParsedInfoObj';

@Component({
  components: {
    DownloadTab,
    PlayTab,
  },
})
export default class Main extends Vue {
  @Inject() pageParser!: PageParser;

  videoInfos: { [lang: string]: ParsedInfoObj } = {};
  tab: string = "download";

  get tabComponent(): any {
    return this.tab === "download" ? DownloadTab : PlayTab;
  }
  get langs(): ILangObj[] {
    return langStore.langs;
  }

  @Watch("langs")
  onLangsChange(): void {
    this.langs.forEach(lang => {
      if (!this.videoInfos[lang.code]) {
        this.pageParser.getFilesInfo(lang).then(info => {
          this.videoInfos = {
            ...this.videoInfos,
            [lang.code]: info
          }
        });
      }
    });
  }

  mounted(): void {
    this.onLangsChange();
  }
}
</script>