import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

(function (): void {
  const { hostname, href } = window.location;
  if (hostname !== "localhost") {
    if (hostname !== "tv.jw.org") {
      return alert(`This script doesn't support this website.`);
    }
    if (!href.includes("/mediaitems/")) {
      return alert(`Please use this script on a video downloading page.`);
    }
  }
  document.write(
    `
<style>.material-icons,.no-select{user-select:none;} .btn:not(.disabled),.pointer{cursor:pointer;}</style>
<div id="app"></div>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
  integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
`
  );

  new Vue({
    el: '#app',
    render: h => h(App)
  });
})();
