/*jshint esversion: 6*/

(function () {
  "use strict";

  window.addEventListener("load", function () {
    api.onUserUpdate(function (e) {
      let username = e.username;
      if (username) window.location.href = "/profile.html";
    });

    function submit() {
      console.log(document.querySelector("form").checkValidity());
      if (document.querySelector("form").checkValidity()) {
        var username = document.querySelector("form [name=email]").value;
        var password = document.querySelector("form [name=password]").value;
        var action = document.querySelector("form [name=action]").value;
        api[action](username, password, function (err) {
          if (err) document.querySelector(".error_box").innerHTML = err;
        });
      }
    }

    document.querySelector("#signin").addEventListener("click", function (e) {
      document.querySelector("form [name=action]").value = "signin";
      submit();
    });

    document.querySelector("#signup").addEventListener("click", function (e) {
      document.querySelector("form [name=action]").value = "signup";
      submit();
    });

    document.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
    });
  });
})();
