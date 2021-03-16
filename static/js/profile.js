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
      document.querySelector("#picture").innerHTML = "";
      items.forEach(function (user) {
        let userElmt = document.createElement("div");
        userElmt.className = "picture";
        userElmt.innerHTML = `
          <img src="media/26344-4-hellsing-transparent.png" class="image" />
          <h1 class="image_name">${user.name}</h1>
          <h3 class="image_age">${user.age}</h3>
          <h3 class="image_gender">${user.gender}</h3>
          <h3 class="image_description">${user.bio}</h3>
            `;
        // add this element to the document
        document.querySelector("#picture").prepend(userElmt);
      });
    });
    // Setting up profile
    document
      .querySelector("#profile_submit")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        let name = document.querySelector("#profile_name").value;
        let age = document.querySelector("#profile_age").value;
        let gender = document.querySelector("#profile_gender").value;
        let bio = document.querySelector("#profile_bio").value;
        let picture = document.querySelector(
          '#profile_submit input[name="image_file"]'
        ).files[0];
        document.querySelector("#profile_submit").reset();
        api.updateProfile(name, age, gender, bio, picture);
        document.getElementById("profile_setup").style.display = "none";
        document.getElementById("profile_design").style.display = "flex";
        document.getElementById("profile_survey").style.display = "flex";
      });
  });
})();
