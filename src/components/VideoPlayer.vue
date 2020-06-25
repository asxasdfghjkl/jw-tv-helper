<template>
  <div
    v-if="!video"
    class="embed-responsive embed-responsive-16by9 d-flex justify-content-center align-items-center video-placeholder"
    style="background: var(--dark, #000000dd);color: white;"
  >
    <span
      class="material-icons"
      style="font-size:40px;"
    >video_library</span>
  </div>
  <div v-else>
    <video
      ref="videoElm"
      controls
      class="embed-responsive embed-responsive-16by9"
      :src="video && video.url"
    >
      <track
        v-if="vtt"
        kind="captions"
        :src="vtt"
        default
      >
    </video>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { IFileItemObj } from '../objs/IFileItemObj';
import * as base64 from "hi-base64";


const dataUrlHeader = "data:text/vtt;base64,";
@Component({
  name: "VideoPlayer"
})
export default class VideoPlayer extends Vue {
  @Prop() video!: IFileItemObj | null;
  @Prop() subtitles!: IFileItemObj[];
  @Prop() playbackRate!: string;

  get vtt(): string | null {
    if (!this.subtitles.length) {
      return null;
    }
    if (this.subtitles.length === 1) {
      return dataUrlHeader + base64.encode(this.subtitles[0].content!);
    }
    const subs = this.subtitles.map(s => {
      const cues = s.content!.replace(/\r/g, "").split("\n\n");
      cues.shift();
      return cues.filter(c => c);
    }).reduceRight((prev, current) => prev.concat(current), []);
    subs.sort((a, b) => a.localeCompare(b));
    subs.unshift("WEBVTT");
    const mergeContent = subs.join("\n\n");
    return dataUrlHeader + base64.encode(mergeContent);
  }

  @Watch("playbackRate")
  updatePlaybackRate() {
    (this.$refs.videoElm as HTMLVideoElement).playbackRate = Math.max(parseFloat(this.playbackRate!) || 1, 0.1);
  }

  mounted() {
    this.updatePlaybackRate();
  }
}
</script>