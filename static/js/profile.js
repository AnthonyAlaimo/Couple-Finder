/*jshint esversion: 6*/

let index = (function () {
  "use strict";

  let module = {};

  window.onload = function () {
    // Hook up logic for signing out
    let signoutButton = document.querySelector("#signout_button");
    signoutButton.addEventListener("click", api.signout);

    // upload users profile picture
    let addImageForm = document.querySelector("#profile_setup");
    addImageForm.addEventListener("submit", onAddImage);

    // Hook up logic for displaying images
    // api.onUserUpdate(onUserUpdated);
    // api.onImageUpdate(onImageRequested);
    // Start initial rendering of UI
    api.changeUser(api.getUsername());

    // submit profile survey
    // document
    //   .querySelector(".profile_setup")
    //   .addEventListener("click", function () {
    //     api.profileSurvey(api.getUsername());
    //   });
  };

  function onImageRequested(e) {
    let image = e.image;
    // Clean up ui
    let imageContainer = document.querySelector("#picture");

    if (image) {
      // Image Container
      imageContainer.innerHTML = `
            <h1 class="image_name">saitama</h1>
            <h3 class="image_age">20</h3>
            <h3 class="image_gender">male</h3>
            <h3 class="image_description">Im a sexy man</h3>
            `;

      // Image elem
      let imageElmn = document.createElement("img");
      imageElmn.className = "gallery_image";
      imageElmn.src = "/api/images/" + image._id + "/image/";
      // add this element to the document
      document.querySelector("#picture").prepend(imageElmn);
    }
  }

  function editProfile(e) {
    e.preventDefault();
    document.querySelector("#profile_setup").style.display = "visible";
    document.querySelector("#profile_design").style.display = "hidden";
    document.querySelector("#profile_survey").style.display = "hidden";
  }
  /**
   * Event handler for when the user submits the add_image_form
   */
  function onAddImage(e) {
    // e.preventDefault();
    // let form = e.target;
    // let imageFile = form.elements.image_file.files[0];
    // api.addImage(imageFile);
    document.querySelector("#profile_setup").style.display = "hidden";
    document.querySelector("#profile_design").style.display = "visible";
    document.querySelector("#profile_survey").style.display = "visible";
    document
      .querySelector("#profile_edit_btn")
      .addEventListener("click", editProfile);
    // form.reset();
  }

  return module;
})();
