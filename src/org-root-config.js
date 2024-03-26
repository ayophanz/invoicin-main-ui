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
        showLoader();
        if (Config.isLocal) {
          return import(
            /* webpackIgnore: true */
            Config.localImportMaps[name]
          );
        }
        return System.import(name);
      })
      .then((app) => {
        removeLoader();
        return app;
      });
  },
});
constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);

start({
  urlRerouteOnly: true,
});

function showLoader() {
  document.body.insertAdjacentHTML(
    "beforeend",
    '<div id="content-loader">Redirecting...</div>'
  );
}
function removeLoader() {
  document.getElementById("content-loader").remove();
}
