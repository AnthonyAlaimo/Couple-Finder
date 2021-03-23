/*jshint esversion: 6*/

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
      error_box.style.visibility = "visible";
    });
    api.onProfileUpdate(function (user) {
      if (!user) {
        window.location.href = "/";
    }
    });
    api.onMatchUpdate(function (matches){
      document.querySelector("#matches").innerHTML = "";
      matches.forEach(function (match) {

        let matchElmt = document.createElement("div");
        imgElmt.className = "match";
        imgElmt.innerHTML = `
          <img class="img" src="/api/pictures/${match.pictures[0].id}/picture/" alt="Image can't be displayed, please try another URL">
          <div class="profile_info">
            <h2 class="name">${match.name} </h2>
            <h3 class="birth_date">${match.age} </h3>
            <h3 class="gender">${match.gender} </h3>
            <h4 class="bio">${match.bio} </h4>
          </div>
            `;
        // liking and disliking a match
        matchElmt
        .querySelector(".icon_dislike")
        .addEventListener("click", function () {
          api.matchLike();
        });
        matchElmt
        .querySelector(".icon_like")
        .addEventListener("click", function () {
          api.matchDislike();
        });
        document.querySelector("#img_layout").prepend(matchElmt);
      })
    })
    document.querySelector("#signout_button").addEventListener("click", function (e) {
      api.signout();
    });
  });
})();
