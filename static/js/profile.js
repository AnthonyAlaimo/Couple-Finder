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
    api.onProfileUpdate(function (items) {
      document.querySelector("#profile").innerHTML = "";
      items.forEach(function (user) {
        let userElmt = document.createElement("div");
        userElmt.innerHTML = `
          <img class="img" src="/api/image/${user._id}/image" alt="Image can't be displayed, please try another URL">
          <h1 class="name">${user.name} </h1>
          <h3 class="birth_date">${user.birth_date} </h3>
          <h3 class="gender">${user.gender} </h3>
          <h3 class="bio">${user.bio} </h3>
            `;
        // add this element to the document
        document.querySelector("#profile").prepend(userElmt);
      });
    });
    // Setting up profile
    document
      .querySelector("#profile_submit")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        let name = document.querySelector("#profile_name").value;
        let birth_date = document.querySelector("#birth_date").value;
        let gender = document.querySelector("#profile_gender").value;
        let bio = document.querySelector("#profile_bio").value;
        let picture = document.querySelector(
          '#profile_submit input[name="image_file"]'
        ).files[0];
        document.querySelector("#profile_submit").reset();
        api.updateProfile(name, gender, birth_date, bio, picture);
        document.getElementById("profile_setup").style.display = "none";
        document.getElementById("profile_design").style.display = "flex";
        document.getElementById("profile_survey").style.display = "flex";
      });
  });
})();
