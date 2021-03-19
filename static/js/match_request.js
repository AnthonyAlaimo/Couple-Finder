/*jshint esversion: 6 */
(function () {
    "use strict";
  
    window.addEventListener("load", function () {
      //error checking
      api.onError(function (err) {
        console.error("[error]", err);
        if  (err === "[401]Access Denied"){
          window.location.href = "/";
        }
      });
  
      api.onError(function (err) {
        var error_box = document.querySelector("#error_box");
        error_box.innerHTML = err;
        error_box.style.visibility = "hidden";
      });
    });
  })();