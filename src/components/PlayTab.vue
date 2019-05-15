<template>
  <div class="row">
    <div class="col-12">
      <VideoPlayer
        :video="video"
        :subtitles="subtitles"
        :key="playerKey"
      />
      <div class="card my-3">
        <div class="card-header d-flex">
          <span class="material-icons">file_copy</span>
          Player Files
        </div>
        <ul class="list-group list-group-flush">
          <li
            v-if="video"
            class="list-group-item d-flex"
          >
            <div class="d-flex p-2">
              <span class="material-icons">videocam</span>
              {{ video.lang.name }}
            </div>
          </li>
          <li
            v-for="sub in subtitles"
            :key="sub.lang.code"
            class="list-group-item d-flex justify-content-between"
          >
            <div class="d-flex p-2">
              <span class="material-icons">subtitles</span>
              {{ sub.lang.name }}
            </div>
            <div
              class="btn material-icons rounded-pill p-2"
              @click="removeSubtitles(sub)"
            >close</div>
          </li>
        </ul>
      </div>
    </div>
    <div
      v-for="lang in langs"
      :key="lang.code"
      class="col-12 col-md-6 col-xl-4"
    >
      <LanguageDetail
        :lang="lang"
        :info="videoInfos[lang.code]"
        :onLinkClick="onLinkClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { IVideoInfoObj } from '../objs/IVideoInfoObj';
import { ILangObj } from '@/objs/ILangObj';
import { IFileItemObj } from '@/objs/IFileItemObj';
import LanguageDetail from '@/components/LanguageDetail.vue';
import Axios from 'axios';
import VideoPlayer from './VideoPlayer.vue';

@Component({
  components: {
    LanguageDetail,
    VideoPlayer
  }
})
export default class PlayTab extends Vue {
  @Prop() langs!: ILangObj[];
  @Prop() videoInfos!: { [lang: string]: IVideoInfoObj };

  video: IFileItemObj | null = null;
  subtitles: IFileItemObj[] = [];
  downloadedSubtitles: IFileItemObj[] = [];
  playerKey: number = this.newPlayerKey();

  newPlayerKey(): number {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }

  @Watch('video')
  watchVideoChanged() {
    this.playerKey = this.newPlayerKey();
  }

  @Watch("subtitles")
  watchSubtitlesChange(){
    this.playerKey = this.newPlayerKey();
  }

  onLinkClick(file: IFileItemObj) {
    if (file.url.endsWith('.vtt')) {
      const downloaded = this.downloadedSubtitles.find(d => d.lang.code === file.lang.code);
      if (downloaded) {
        this.loadSubtitleFromDownloaded(file.lang.code);
      } else {
        Axios.get(file.url).then(response => {
          file.content = response.data;
          this.downloadedSubtitles.push(file);
          this.loadSubtitleFromDownloaded(file.lang.code);
        })
      }
    } else {
      this.video = file;
    }
    return false;
  }

  loadSubtitleFromDownloaded(langCode: string) {
    const exist = this.subtitles.find(s => s.lang.code === langCode);
    if (!exist) {
      this.subtitles.push(this.downloadedSubtitles.find(d => d.lang.code === langCode)!);
    }
  }

  removeSubtitles(sub: IFileItemObj) {
    this.subtitles = this.subtitles.filter(s => s !== sub);
  }
}
</script>