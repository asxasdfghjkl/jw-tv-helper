<template>
  <div
    id="app"
    class="d-flex flex-column vh-100"
  >
    <Appbar />
    <Main />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Inject } from 'vue-property-decorator';
import Appbar from '@/components/Frame/Appbar.vue';
import Main from '@/components/Frame/Main.vue';

@Component({
  components: {
    Appbar,
    Main
  },
})
export default class App extends Vue {
  @Provide() url: string = window.location.hostname === 'localhost'
    ? 'https://tv.jw.org/#cmn-hant/mediaitems/StudioMonthly2019/pub-jwb_201905_1_VIDEO'
    : window.location.href;
}
</script>