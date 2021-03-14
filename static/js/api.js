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

  // let imageRequestedEvent = new CustomEvent("imageRequested");
  // module.imageRequestedEvent = imageRequestedEvent;

  //   let commentPageRequestedEvent = new CustomEvent("commentPageRequested");
  //   module.commentPageRequestedEvent = commentPageRequestedEvent;

  // let userUpdatedEvent = new CustomEvent("userUpdated");
  // module.userUpdatedEvent = userUpdatedEvent;

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

  let userListeners = [];

  // User login setup
  let getUserProfile = function () {
    send("GET", "/api/profile/", null, function (err, res) {
      if (err) return notifyErrorListeners(err);
      console.log(res);
      notifyUserListeners(res.email);
    });
  };

  function notifyUserListeners(email) {
    userListeners.forEach(function (listener) {
      listener(email);
    });
  }

  module.onUserUpdate = function (listener) {
    userListeners.push(listener);
    listener(getUserProfile());
  };

  // post request for signing in
  module.signin = function (email, password) {
    send(
      "POST",
      "/signin/",
      { email: email, password: password },
      function (err, res) {
        if (err) return notifyErrorListeners(err);
        getUserProfile();
      }
    );
  };

  // post request for signing up
  module.signup = function (email, password) {
    send(
      "POST",
      "/signup/",
      { email: email, password: password },
      function (err, res) {
        if (err) return notifyErrorListeners(err);
        getUserProfile();
      }
    );
  };

  // save user profile information
  module.updateProfile = function (name, gender, age, bio, picture) {
    send(
      "PUT",
      "/api/profile/",
      {
        name: name,
        gender: gender,
        age: age,
        bio: bio,
      },
      function (err, res) {
        if (err) return notifyErrorListeners(err);
        notifyProfileListeners();
      }
    );
  };

  let getProfile = function (callback) {
    send("GET", "/api/profile/", null, callback);
  };
  let profileListeners = [];
  function notifyProfileListeners() {
    getProfile(function (err, profile) {
      if (err) return notifyErrorListeners(err);
      profileListeners.forEach(function (listener) {
        listener([profile]);
      });
    });
  }
  module.onProfileUpdate = function (listener) {
    profileListeners.push(listener);
    getProfile(function (err, profile) {
      if (err) return notifyErrorListeners(err);
      listener([profile]);
    });
  };

  let errorListeners = [];

  //error functions
  function notifyErrorListeners(err) {
    errorListeners.forEach(function (listener) {
      listener(err);
    });
  }

  module.onError = function (listener) {
    errorListeners.push(listener);
  };
  return module;
})();
