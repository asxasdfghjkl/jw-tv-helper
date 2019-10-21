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
import { Component, Vue, Provide, Inject } from "vue-property-decorator";
import Appbar from "@/components/Frame/Appbar.vue";
import Main from "@/components/Frame/Main.vue";
import { ILangObj } from "@/objs/ILangObj";
import LangStore from "@/stores/lang.store";

@Component({
  components: {
    Appbar,
    Main,
  },
})
export default class App extends Vue {
  @Provide() url: string = window.location.hostname === "localhost"
    // tslint:disable-next-line:max-line-length
    ? "https://jw.org/cmn-hant/%E5%A4%9A%E5%AA%92%E9%AB%94%E5%9C%96%E6%9B%B8%E9%A4%A8/%E5%BD%B1%E7%89%87/#cmn-hant/mediaitems/StudioFeatured/pub-jwb_201910_1_VIDEO"
    : window.location.href;
}
</script>