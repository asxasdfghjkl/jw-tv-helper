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
      <div class="btn btn-primary material-icons rounded-pill p-2">translate</div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
})
export default class Appbar extends Vue {
  onBackToSite() {
    window.location.reload();
  }
}
</script>
