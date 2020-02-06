import Vue from "vue";
import App from "./App.vue";
import { createPageParser } from './PageParsers/PageParserFactory';

Vue.config.productionTip = false;

function init() {
  if (!["localhost", "jw.org", "www.jw.org"].includes(window.location.hostname)) {
    return alert(`This script doesn't support this website.`);
  }
  const pageParser = createPageParser();
  if (!pageParser) {
    return alert(`This script can't detect video form this page.`);
  }
  document.write(
    `
<style>
.material-icons,.no-select{user-select:none;}
.btn:not(.disabled),.pointer{cursor:pointer;}
.modal.backdrop{background-color:#00000088;}
</style>
<div id="app"></div>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
`
  );

  // tslint:disable-next-line: no-unused-expression
  new Vue({
    el: "#app",
    render: h => h(App, { props: { pageParser } })
  });
}

init();
