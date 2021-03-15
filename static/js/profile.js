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
      items.forEach(function (img) {
        let imgElmt = document.createElement("div");
        imgElmt.className = "picture";
        imgElmt.innerHTML = `
          <img src="media/26344-4-hellsing-transparent.png" class="image" />
          <h1 class="image_name">${img.name}</h1>
          <h3 class="image_age">${img.age}</h3>
          <h3 class="image_gender">${image.gender}</h3>
          <h3 class="image_description">${image.bio}</h3>
            `;
        // add this element to the document
        document.querySelector("#picture").prepend(imgElmt);
      });
    });
    // Setting up profile
    document
      .querySelector("#create_profile_form")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        let name = document.querySelector("#profile_name").value;
        let age = document.querySelector("#profile_age").value;
        let gender = document.querySelector("#profile_gender").value;
        let bio = document.querySelector("#profile_bio").value;
        // let picture = document.querySelector(
        //   '#create_profile_form input[name="picture"]'
        // ).files[0];
        document.querySelector("#create_profile_form").reset();
        api.updateProfile(name, age, gender, bio);
        document.getElementById("profile_setup").style.visibility = "hidden";
        document.getElementById("profile_design").style.visibility = "visible";
        document.getElementById("profile_survey").style.visibility = "visible";
      });
  });
})();
