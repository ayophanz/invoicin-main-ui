import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";

const routes = constructRoutes(document.querySelector("#single-spa-layout"));
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return Promise.resolve()
      .then(() => {
        if (window.location.pathname != '/login') {
          showLoader(name);
        }
        if (Config.isLocal) {
          return import(
            /* webpackIgnore: true */
            Config.localImportMaps[name]
          );
        }
        setTimeout(function () {
          return System.import(name);
        }, 10000);
      })
      .then(sleeper(1000))
      .then((app) => {
        if (window.location.pathname != '/login') {
          removeLoader();
        }
        return app;
      });
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);

start({
  urlRerouteOnly: true,
});

function showLoader(name) {
  let appId = "none";
  let customClass = "";
  let tag = document.body;
  if (name === "@invoicin/dashboard-ui") {
    appId = "dashboard-ui";
    customClass = "dashboard-ui-style";
    tag = document.getElementById(appId);
  }
  tag.insertAdjacentHTML(
    "beforeend",
    '<div id="content-loader" class="' + customClass + '">' +
      '<div class="loadingio-spinner-bars-9ky0l3udq1c"><div class="ldio-ru85idovvwTEST">' +
      "<div></div><div></div><div></div><div></div>" +
      "</div></div>" +
      "</div>"
  );
}
function removeLoader() {
  document.getElementById("content-loader").remove();
}
function sleeper(ms) {
  return function (x) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms));
  };
}
