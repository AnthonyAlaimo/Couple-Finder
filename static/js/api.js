/*jshint esversion: 6*/

let api = (function () {
  "use strict";

  let module = {};

  /*  ******* Data types *******
        image objects must have at least the following attributes:
            - (String) imageId 
            - (String) title
            - (String) author
            - (String) url
            - (Date) date
    
        comment objects must have the following attributes
            - (String) commentId
            - (String) imageId
            - (String) author
            - (String) content
            - (Date) date
    
    ****************************** */

  let imageRequestedEvent = new CustomEvent("imageRequested");
  module.imageRequestedEvent = imageRequestedEvent;

  let commentPageRequestedEvent = new CustomEvent("commentPageRequested");
  module.commentPageRequestedEvent = commentPageRequestedEvent;

  let userUpdatedEvent = new CustomEvent("userUpdated");
  module.userUpdatedEvent = userUpdatedEvent;

  function send(method, url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status !== 200)
        callback("[" + xhr.status + "]" + xhr.responseText, null);
      else callback(null, JSON.parse(xhr.responseText));
    };
    xhr.open(method, url, true);
    if (!data) xhr.send();
    else {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(data));
    }
  }

  function sendFiles(method, url, data, callback) {
    let formdata = new FormData();
    Object.keys(data).forEach(function (key) {
      let value = data[key];
      formdata.append(key, value);
    });
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status !== 200)
        callback("[" + xhr.status + "]" + xhr.responseText, null);
      else callback(null, JSON.parse(xhr.responseText));
    };
    xhr.open(method, url, true);
    xhr.send(formdata);
  }

  // Sign up user
  module.signup = function (username, password) {
    send(
      "POST",
      "/signup/",
      { username: username, password: password },
      function (err, item) {
        if (err) {
          notifyErrorHandlers(err);
        } else {
          module.changeUser(module.getUsername());
        }
      }
    );
  };

  // Sign in user
  module.signin = function (username, password) {
    send(
      "POST",
      "/signin/",
      { username: username, password: password },
      function (err, item) {
        if (err) {
          notifyErrorHandlers(err);
        } else {
          module.changeUser(module.getUsername());
        }
      }
    );
  };

  // Signout current user
  module.signout = function () {
    send("GET", "/signout/", {}, function (err, item) {
      if (err) {
        notifyErrorHandlers(err);
      } else {
        module.changeUser(module.getUsername());
      }
    });
  };

  // Get list of all users from server
  module.getAllUsers = function (callback) {
    send("GET", "/api/users/", {}, function (err, items) {
      if (err) {
        notifyErrorHandlers(err);
      } else {
        callback(items);
      }
    });
  };

  // add an image to the gallery
  module.addImage = function (title, imageFile) {
    sendFiles(
      "POST",
      "/api/images/",
      { title: title, picture: imageFile },
      function (err, item) {
        if (err) {
          notifyErrorHandlers(err);
        } else {
          module.getImageGallery(item.author);
        }
      }
    );
  };

  // Delete an image from the gallery given its imageId.
  module.deleteImage = function (imageId) {
    send("DELETE", "/api/images/" + imageId + "/", {}, function (err, item) {
      if (err) {
        notifyErrorHandlers(err);
      } else {
        notifyImageHandlers(item);
      }
    });
  };

  // Get default image of user from the server.
  // Serves as an entrypoint into the user's gallery.
  module.getImageGallery = function (username) {
    send("GET", "/api/images/" + username + "/", null, function (err, item) {
      if (err) {
        notifyErrorHandlers(err);
      } else {
        notifyImageHandlers(item);
      }
    });
  };

  // Get prev or next image from server
  module.getLinkedImage = function (imageId, action) {
    send(
      "GET",
      "/api/images/" + imageId + "/" + action + "/",
      {},
      function (err, item) {
        if (err) {
          notifyErrorHandlers(err);
        } else {
          notifyImageHandlers(item);
        }
      }
    );
  };

  // add a comment to an image
  module.addComment = function (imageId, content) {
    send(
      "POST",
      "/api/comments/" + imageId + "/",
      { content: content },
      function (err, item) {
        if (err) {
          notifyErrorHandlers(err);
        } else {
          module.getCommentPageForImage(imageId, 0);
        }
      }
    );
  };

  // Get page of 10 comments from image given by imageId
  // or the last page available if requested page does not exist.
  module.getCommentPageForImage = function (imageId, page) {
    send(
      "GET",
      "/api/comments/" + imageId + "/?page=" + page + "/",
      {},
      function (err, items) {
        if (err) {
          notifyErrorHandlers(err);
        } else {
          notifyCommentHandlers(items);
        }
      }
    );
  };

  // Deletes a comment from an image
  module.deleteComment = function (commentId) {
    send(
      "DELETE",
      "/api/comments/" + commentId + "/",
      {},
      function (err, items) {
        if (err) {
          notifyErrorHandlers(err);
        } else {
          notifyCommentHandlers(items);
        }
      }
    );
  };

  // Add new event listener to the usersUpdated event
  module.onUserUpdate = function (handler) {
    window.addEventListener("userUpdated", handler);
  };

  // Changes the current user context to the specified username
  module.changeUser = function (username) {
    notifyUserHandlers(username);
  };

  // Fire userUpdatedEvent for all listeners
  function notifyUserHandlers(username) {
    module.userUpdatedEvent.username = username;
    window.dispatchEvent(module.userUpdatedEvent);
  }

  // Get username of current user from browser cookies
  module.getUsername = function () {
    let username = document.cookie.replace(
      /(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    username = decodeURI(username);
    return username;
  };

  // call handler when new image is requested
  module.onImageUpdate = function (handler) {
    window.addEventListener("imageRequested", handler);
  };

  // Notifies all image listeners that an image has been retrieved
  function notifyImageHandlers(image) {
    module.imageRequestedEvent.image = image;
    window.dispatchEvent(module.imageRequestedEvent);
  }

  // call handler when a comment is added or deleted to an image
  module.onCommentUpdate = function (handler) {
    window.addEventListener("commentPageRequested", handler);
  };

  // Fires onCommentPageRequested event for all listeners with the given imageIndex and page as parameters
  function notifyCommentHandlers(comments) {
    module.commentPageRequestedEvent.comments = comments;
    window.dispatchEvent(module.commentPageRequestedEvent);
  }

  // Logs error to console and displays in UI for 2 seconds
  function notifyErrorHandlers(err) {
    console.error("[error]", err);
    var error_box = document.querySelector("#error_box");
    error_box.innerHTML = err;
    error_box.style.visibility = "visible";
    window.setTimeout(function () {
      error_box.innerHTML = "";
      error_box.style.visiblity = "hidden";
    }, 2000);
  }
  return module;
})();
