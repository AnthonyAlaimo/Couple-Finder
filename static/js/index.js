/*jshint esversion: 6*/

let index = (function () {
  "use strict";

  let module = {};

  //   let imageFormVisible = true;

  //   let currentImageId = null;

  //   window.onload = function () {
  //     // Hook up logic for toggling add_image_form
  //     let imageFormToggleButton = document.querySelector(
  //       "#toggle_add_image_form"
  //     );
  //     imageFormToggleButton.addEventListener("click", onToggleImageForm);
  //     // Hook up logic for signing out
  //     let signoutButton = document.querySelector("#signout_button");
  //     signoutButton.addEventListener("click", api.signout);
  //     // Hook up logic for switching user galleries
  //     let userSelect = document.querySelector("#user_select");
  //     userSelect.addEventListener("change", onSelectUser);
  //     // Hook up logic for displaying images
  //     api.onUserUpdate(onUserUpdated);
  //     api.onImageUpdate(onImageRequested);
  //     api.onCommentUpdate(onCommentPageRequested);
  //     // Hook up logic for adding an image to gallery
  //     let addImageForm = document.querySelector("#add_image_form");
  //     addImageForm.addEventListener("submit", onAddImage);
  //     // Hook up logic for adding a comment to the image
  //     let addCommentForm = document.querySelector("#add_comment_form");
  //     addCommentForm.addEventListener("submit", (e) =>
  //       onAddComment(e, currentImageId)
  //     );
  //     addCommentForm.style.display = "none";
  //     // Start initial rendering of UI
  //     api.changeUser(api.getUsername());
  //   };

  /**
   * Event handler for the toggle add_image_form button.
   */
  //   function onToggleImageForm(e) {
  //     let form = document.querySelector("#add_image_form");
  //     form.childNodes.forEach((element) => {
  //       if (imageFormVisible) {
  //         if (element.className !== "form_title" && element.style) {
  //           element.style.display = "none";
  //         }
  //       } else if (element.className !== "form_title" && element.style) {
  //         element.style.display = "inline";
  //       }
  //     });
  //     imageFormVisible = !imageFormVisible;
  //   }

  /**
   * Event handler for when the user submits the add_image_form
   */
  //   function onAddImage(e) {
  //     e.preventDefault();
  //     let form = e.target;
  //     let imageTitle = form.elements.image_title.value;
  //     let imageFile = form.elements.image_file.files[0];
  //     api.addImage(imageTitle, imageFile);
  //     form.reset();
  //   }

  /**
   * Event handler for when the selected user changes
   */
  //   function onSelectUser(e) {
  //     let username = e.target.value;
  //     api.changeUser(username);
  //   }

  /**
   * Event handler for when the user session is updated.
   * Occurs on signup/signin, signout and when a new user is selected
   */
  //   function onUserUpdated(e) {
  //     let username = e.username;

  //     // Configure visibility of UI elements based on authentication
  //     document.querySelector("#signin_button").style.visibility = username
  //       ? "hidden"
  //       : "visible";
  //     document.querySelector("#signout_button").style.visibility = username
  //       ? "visible"
  //       : "hidden";
  //     document.querySelector("#add_image_form").style.visibility = username
  //       ? "visible"
  //       : "hidden";
  //     document.querySelector("#user_select_box").style.visibility = username
  //       ? "visible"
  //       : "hidden";

  //     // Clean up UI
  //     let imageContainer = document.querySelector("#image_container");
  //     while (imageContainer.firstChild) {
  //       imageContainer.removeChild(imageContainer.firstChild);
  //     }
  //     let addCommentForm = document.querySelector("#add_comment_form");
  //     addCommentForm.style.display = "none";
  //     let commentsContainer = document.querySelector("#comments_container");
  //     while (commentsContainer.firstChild) {
  //       commentsContainer.removeChild(commentsContainer.firstChild);
  //     }
  //     // Configure image gallery UI for authenticated user
  //     if (username) {
  //       document.querySelector("#add_image_form").style.display =
  //         username === api.getUsername() ? "flex" : "none";
  //       updateUsersList(username);
  //     }
  //   }

  /**
   * Populates users select with all users from the back end and triggers the image gallery
   * for the specified user to display
   * @param {string} username
   */
  //   function updateUsersList(username) {
  //     api.getAllUsers(function (users) {
  //       // Add all users to users_select
  //       let userSelect = document.querySelector("#user_select");
  //       userSelect.innerHTML = "";
  //       users.forEach(function (user) {
  //         var element = document.createElement("option");
  //         element.value = user._id;
  //         element.text = user._id;
  //         userSelect.prepend(element);
  //       });
  //       userSelect.value = username;

  //       // Request first image of selected user to display
  //       api.getImageGallery(username);
  //     });
  //   }

  /**
   * Event handler for when a new image is requested to be displayed.
   */
  //   function onImageRequested(e) {
  //     let image = e.image;
  //     // Clean up ui
  //     let imageContainer = document.querySelector("#image_container");
  //     while (imageContainer.firstChild) {
  //       imageContainer.removeChild(imageContainer.firstChild);
  //     }
  //     let addCommentForm = document.querySelector("#add_comment_form");
  //     addCommentForm.style.display = "none";
  //     let commentsContainer = document.querySelector("#comments_container");
  //     while (commentsContainer.firstChild) {
  //       commentsContainer.removeChild(commentsContainer.firstChild);
  //     }

  //     if (image) {
  //       // Image Container
  //       imageContainer.innerHTML = `
  //             <h1 class="image_title">${image.title}</h1>
  //             <h3 class="image_author">By ${image.author}</h3>
  //             `;

  //       let imagePanel = document.createElement("div");
  //       imagePanel.id = "image_panel";
  //       imagePanel.className = "row_flex_panel";

  //       // Prev Arrow
  //       let prevArrow = document.createElement("div");
  //       prevArrow.className = "button_left icon";
  //       prevArrow.addEventListener("click", () =>
  //         api.getLinkedImage(image._id, "prev")
  //       );
  //       if (!image.hasPrev) {
  //         prevArrow.style.visibility = "hidden";
  //       }
  //       imagePanel.appendChild(prevArrow);

  //       // Image elem
  //       let imageElmn = document.createElement("img");
  //       imageElmn.className = "gallery_image";
  //       imageElmn.src = "/api/images/" + image._id + "/image/";
  //       imagePanel.appendChild(imageElmn);

  //       // Delete Button
  //       let deleteButton = document.createElement("div");
  //       deleteButton.className = "button_delete icon";
  //       deleteButton.addEventListener("click", () => api.deleteImage(image._id));
  //       imagePanel.appendChild(deleteButton);

  //       // Next Arrow
  //       let nextArrow = document.createElement("div");
  //       nextArrow.className = "button_right icon";
  //       nextArrow.addEventListener("click", () =>
  //         api.getLinkedImage(image._id, "next")
  //       );
  //       if (!image.hasNext) {
  //         nextArrow.style.visibility = "hidden";
  //       }
  //       imagePanel.appendChild(nextArrow);

  //       imageContainer.appendChild(imagePanel);

  //       addCommentForm.style.display = "flex";
  //       currentImageId = image._id;
  //       api.getCommentPageForImage(image._id, 0);
  //     }
  //   }

  //   /**
  //    * Event handler for when a comment is added to an image
  //    */
  //   function onAddComment(e, imageId) {
  //     e.preventDefault();
  //     let form = e.target;
  //     let commentContent = form.elements.comment_content.value;
  //     api.addComment(imageId, commentContent);
  //     form.reset();
  //   }

  //   /**
  //    * Event handler for when a page of comments is requested. Can only be requested in the context of an image
  //    */
  //   function onCommentPageRequested(e, comments) {
  //     if (comments === null || comments === undefined) {
  //       comments = e.comments;
  //     }
  //     let items = comments.items;
  //     // Find current comments html element and delete children
  //     let commentsContainer = document.querySelector("#comments_container");
  //     while (commentsContainer.firstChild) {
  //       commentsContainer.removeChild(commentsContainer.firstChild);
  //     }

  //     if (items.length > 0) {
  //       // Prev Arrow
  //       let prevArrow = document.createElement("div");
  //       prevArrow.className = "button_left icon";
  //       prevArrow.addEventListener("click", () =>
  //         api.getCommentPageForImage(items[0].imageId, comments.page - 1)
  //       );
  //       if (comments.page < 1) {
  //         prevArrow.style.visibility = "hidden";
  //       }
  //       commentsContainer.appendChild(prevArrow);

  //       // Comments panel
  //       let commentsPanel = document.createElement("div");
  //       commentsPanel.id = "comments";
  //       commentsPanel.className = "column_flex_panel";

  //       items.forEach((comment) => {
  //         // Panel to render comment_username and comment_content side by side
  //         let commentElmnt = document.createElement("div");
  //         commentElmnt.className = "comment row_flex_panel";

  //         // Panel to render comment_username information
  //         let commentUserElmnt = document.createElement("div");
  //         commentUserElmnt.className = "comment_user column_flex_panel";

  //         // Format date into readable string
  //         let dateString = new Date(comment.createdAt).toLocaleString();
  //         commentUserElmnt.innerHTML = `
  //                 <div class="comment_username">${comment.author}</div>
  //                 <div class="comment_date">${dateString}</div>
  //                 `;
  //         commentElmnt.appendChild(commentUserElmnt);

  //         // Panel to render comment content
  //         let commentContentElmnt = document.createElement("div");
  //         commentContentElmnt.className = "comment_content";
  //         commentContentElmnt.innerText = comment.content;
  //         commentElmnt.appendChild(commentContentElmnt);

  //         // Delete button to remove comment
  //         let deleteButton = document.createElement("div");
  //         deleteButton.className = "button_delete icon";
  //         deleteButton.addEventListener("click", () =>
  //           api.deleteComment(comment._id)
  //         );
  //         commentElmnt.appendChild(deleteButton);

  //         commentsPanel.appendChild(commentElmnt);
  //       });
  //       commentsContainer.appendChild(commentsPanel);

  //       // Next Arrow
  //       let nextArrow = document.createElement("div");
  //       nextArrow.className = "button_right icon";
  //       nextArrow.addEventListener("click", () =>
  //         api.getCommentPageForImage(items[0].imageId, comments.page + 1)
  //       );
  //       if (!comments.hasNext) {
  //         nextArrow.style.visibility = "hidden";
  //       }
  //       commentsContainer.appendChild(nextArrow);
  //     }
  //   }
  return module;
})();
