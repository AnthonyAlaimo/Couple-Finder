/*jshint esversion: 6*/

(function () {
  "use strict";

  window.addEventListener("load", function () {
    // Setting up profile
    document.querySelector("#filters").addEventListener("click", function (e) {
      api.toggle_visibility("#filter_options_display");

      // e.preventDefault();
      // let name = document.querySelector("#profile_name").value;
      // let age = document.querySelector("#profile_age").value;
      // let gender = document.querySelector("#profile_gender").value;
      // let bio = document.querySelector("#profile_bio").value;
      // let picture = document.querySelector(
      //   '#profile_submit input[name="image_file"]'
      // ).files[0];
      // document.querySelector("#profile_submit").reset();
      // api.updateProfile(name, age, gender, bio, picture);
      // document.getElementById("profile_setup").style.display = "none";
      // document.getElementById("profile_design").style.display = "flex";
      // document.getElementById("profile_survey").style.display = "flex";
    });
  });
})();
