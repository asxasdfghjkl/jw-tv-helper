<template>
  <div class="card mb-3">
    <template v-if="!info">
      <div class="card-header">
        [{{lang.name}}]
      </div>
      <div class="card-body">
        <div class="d-flex align-items-center">
          <strong>Loading...</strong>
          <div
            class="spinner-border ml-auto"
            role="status"
            aria-hidden="true"
          ></div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="card-header">
        [{{lang.name}}]
        <span class="font-weight-bold">{{info.title}}</span>
      </div>
      <ul class="list-group list-group-flush">
        <li
          v-for="file in info.files"
          :key="file.label"
          class="list-group-item d-flex justify-content-between no-select"
        >
          {{file.label}}
          <div>
            <a
              class="material-icons btn btn-secondary mr-2"
              :href="file.progressiveDownloadURL"
              @click.stop="onClick($event, file.progressiveDownloadURL, lang)"
            >videocam</a>
            <a
              :class="['material-icons btn btn-secondary', {disabled: !file.subtitles}]"
              :href="file.subtitles && file.subtitles.url"
              @click.stop="onClick($event, file.subtitles && file.subtitles.url, lang)"
            >subtitles</a>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IVideoFileObj, IVideoInfoObj } from '@/objs/IVideoInfoObj';
import { ILangObj } from '../objs/ILangObj';
import VideoPlayer from '@/components/VideoPlayer.vue';
import { IFileItemObj } from '../objs/IFileItemObj';

@Component({
  name: "LanguageDetail",
  components: {
    VideoPlayer,
  },
})
export default class LanguageDetail extends Vue {
  @Prop() info?: IVideoInfoObj;
  @Prop() lang!: ILangObj;
  @Prop() onLinkClick!: (file: IFileItemObj) => boolean;

  onClick(evt: Event, url: string, lang: ILangObj) {
    if (!this.onLinkClick({ url, lang })) {
      evt.preventDefault();
    }
  }
}
</script>