/*jshint esversion: 6 */
(function () {
  "use strict";
  window.addEventListener("load", function () {
    //error checking
    api.onError(function (err) {
      console.error("[error]", err);
    });

    api.onError(function (err) {
      var error_box = document.querySelector("#error_box");
      error_box.innerHTML = err;
      error_box.style.visibility = "visible";
    });

    api.onUserUpdate(function (email) {
      document.querySelector("#signin_button").style.visibility = email
        ? "hidden"
        : "visible";
      document.querySelector("#signout_button").style.visibility = email
        ? "visible"
        : "hidden";
    });
  });
})();
