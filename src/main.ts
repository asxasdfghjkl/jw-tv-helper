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
<div id="app"></div>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
  integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
`
  );

  new Vue({
    render: h => h(App),
  }).$mount("#app");
})();