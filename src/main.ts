import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

(function (): void {
  const { hostname, href } = window.location;
  if (hostname !== "localhost") {
    if (hostname !== "jw.org" && hostname !== "www.jw.org") {
      return alert(`This script doesn't support this website.`);
    }
    if (!href.includes("/mediaitems/")) {
      return alert(`Please use this script on a video downloading page or this video is not supported.`);
    }
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
    render: h => h(App)
  });
})();
