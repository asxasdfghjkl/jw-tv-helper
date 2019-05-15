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
import Axios from "axios";
import { IVideoInfoObj } from "@/objs/IVideoInfoObj";
import DownloadTab from "@/components/DownloadTab.vue";
import PlayTab from "@/components/PlayTab.vue";
import { ILangObj } from "@/objs/ILangObj";
import langStore from "@/stores/lang.store";

@Component({
  components: {
    DownloadTab,
    PlayTab,
  },
})
export default class Main extends Vue {
  @Inject() url!: string;

  videoInfos: { [lang: string]: IVideoInfoObj } = {};
  tab: string = "download";

  get tabComponent(): any {
    return this.tab === "download" ? DownloadTab : PlayTab;
  }
  get langs(): ILangObj[] {
    return langStore.langs;
  }
  get videoId(): string {
    const lastSlash: number = this.url.lastIndexOf("/");
    return this.url.substring(lastSlash + 1);
  }

  @Watch("langs")
  onLangsChange(): void {
    this.langs.forEach(async lang => {
      if (this.videoInfos[lang.code]) {
        return;
      }
      const url: string = `https://data.jw-api.org/mediator/v1/media-items/${lang.code}/${this.videoId}?clientType=tvjworg`;
      if (localStorage[url]) {
        this.videoInfos = {
          ...this.videoInfos,
          [lang.code]: JSON.parse(localStorage[url]).media[0]
        };
      } else {
        Axios.get(url).then(res => {
          this.videoInfos = {
            ...this.videoInfos,
            [lang.code]: res.data.media[0]
          };
        });
      }
    });
  }

  mounted(): void {
    this.onLangsChange();
  }
}
</script>