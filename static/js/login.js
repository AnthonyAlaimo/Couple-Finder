(function () {
  "use strict";

  window.addEventListener("load", function () {
    api.onError(function (err) {
      console.error("[error]", err);
    });

    api.onError(function (err) {
      var error_box = document.querySelector("#error_box");
      error_box.innerHTML = err;
      error_box.style.visibility = "visible";
    });

    api.onUserUpdate(function (email) {
      if (email) {
        window.location.href = "/profile.html";
      }
    });

    function submit() {
      console.log(document.querySelector("form").checkValidity());
      if (document.querySelector("form").checkValidity()) {
        var email = document.querySelector("form [name=email]").value;
        var password = document.querySelector("form [name=password]").value;
        var action = document.querySelector("form [name=action]").value;
        api[action](email, password, function (err) {
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
