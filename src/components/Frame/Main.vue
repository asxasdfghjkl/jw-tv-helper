<template>
  <div class="flex-grow-1 p-3 overflow-auto">
    <div class="container">
      <ul class="nav nav-tabs">
        <li
          class="nav-item"
          @click="tab='download'"
        >
          <span :class="['nav-link', { active: tab === 'download' }]">
            <span class="material-icons">save_alt</span>
            Download
          </span>
        </li>
        <li
          class="nav-item"
          @click="tab='play'"
        >
          <span :class="['nav-link', { active: tab === 'play' }]">
            <span class="material-icons">play_arrow</span>
            Play
          </span>
        </li>
      </ul>
      <div class="tab-content p-3">
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
import { Component, Vue, Inject } from 'vue-property-decorator';
import Axios from "axios";
import { IVideoInfoObj } from '@/objs/IVideoInfoObj';
import DownloadTab from '@/components/DownloadTab.vue';
import PlayTab from '@/components/PlayTab.vue';

@Component({
  components: {
    DownloadTab,
    PlayTab,
  },
})
export default class Main extends Vue {
  @Inject() url!: string;

  videoInfos: { [lang: string]: IVideoInfoObj } = {};
  tab: string = 'download';

  get langs() {
    return [
      { code: "CH", name: "中文" },
      { code: "E", name: "English" },
      { code: "TG", name: "Tagalog" },
      { code: "J", name: "日文" }
    ];
  }

  get tabComponent() {
    return this.tab === "download" ? DownloadTab : PlayTab;
  }

  mounted() {
    const lastSlash = this.url.lastIndexOf("/");
    const videoId = this.url.substring(lastSlash + 1);
    this.langs.forEach(async lang => {
      const url = `https://data.jw-api.org/mediator/v1/media-items/${lang.code}/${videoId}?clientType=tvjworg`;
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
}
</script>

<style scoped>
.tab-content {
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-top-color: transparent;
}

.nav-link {
  display: inline-flex;
  cursor: pointer;
}
</style>
