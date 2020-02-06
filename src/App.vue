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
import { Component, Vue, Provide, Inject, Prop } from "vue-property-decorator";
import Appbar from "@/components/Frame/Appbar.vue";
import Main from "@/components/Frame/Main.vue";
import { ILangObj } from "@/objs/ILangObj";
import LangStore from "@/stores/lang.store";
import { PageParser } from './PageParsers/PageParser';

@Component({
  components: {
    Appbar,
    Main,
  },
  props: {
    pageParser: Object
  }
})
export default class App extends Vue {
  @Prop() @Provide()
  pageParser!: PageParser;
}
</script>