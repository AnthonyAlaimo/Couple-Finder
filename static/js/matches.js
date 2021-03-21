/*jshint esversion: 6*/

(function () {
  "use strict";

  window.addEventListener("load", function () {
    // Setting up profile
    document.querySelector("#filters").addEventListener("click", function (e) {
      api.toggle_visibility("#filter_options_display");
    });
  });
})();
