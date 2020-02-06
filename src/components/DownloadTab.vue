<template>
  <div class="row">
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
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ILangObj } from '@/objs/ILangObj';
import LanguageDetail from '@/components/LanguageDetail.vue';
import { ParsedInfoObj } from '../objs/ParsedInfoObj';

@Component({
  components: {
    LanguageDetail
  }
})
export default class DownloadTab extends Vue {
  @Prop() langs!: ILangObj[];
  @Prop() videoInfos!: { [lang: string]: ParsedInfoObj };

  onLinkClick() {
    return true;
  }

}
</script>