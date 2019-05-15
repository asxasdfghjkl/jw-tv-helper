<template>
  <nav class="navbar navbar-dark bg-primary">
    <span class="navbar-brand">
      <div
        class="btn btn-primary material-icons rounded-pill p-2"
        @click="onBackToSite"
      >arrow_back</div>
      JW TV Helper
    </span>
    <div class="navbar-actions">
      <div
        class="btn btn-primary material-icons rounded-pill p-2"
        @click="showLangModal=true"
      >translate</div>
    </div>
    <LanguageModal
      v-if="showLangModal"
      @result="showLangModal=false"
    />
  </nav>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import LanguageModal from "@/components/LanguageModal.vue";
import langStore from "@/stores/lang.store";

@Component({
  components: {
    LanguageModal,
  }
})
export default class Appbar extends Vue {
  @Inject() url!: string;

  showLangModal: boolean = false;

  onBackToSite(): void {
    if (window.location.href === this.url) {
      window.location.reload();
    } else {
      window.location.href = this.url;
    }
  }

  mounted(): void {
    this.showLangModal = !langStore.langs.length;
    window.history.pushState(undefined, "JW TV Helper", this.url + "#tv_helper");
    window.addEventListener("hashchange", this.onBackToSite);
  }
}
</script>
