/*jshint esversion: 6*/
let api = (function () {
  "use strict";

  let module = {};

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


  ///////////USER SIGNIN/SIGNUP CODE///////////////
  let userListeners = [];

  function notifyUserListeners(email) {
    userListeners.forEach(function (listener) {
      listener(email);
    });
  }

  module.onUserUpdate = function (listener) {
    userListeners.push(listener);
    send("GET", "/api/profile/", null, function (err, res) {
      if (err) return notifyErrorListeners(err);
      listener(res.email);
    });
  };

  // post request for signing in
  module.signin = function (email, password) {
    send(
      "POST",
      "/signin/",
      { email: email, password: password },
      function (err, res) {
        if (err) return notifyErrorListeners(err);
        notifyUserListeners(email);
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
        notifyUserListeners(email);
      }
    );
  };

  //////////PROFILE CODE///////////
  // save user profile information
  module.updateProfile = function (name, gender, birth_date, bio, profile_picture) {
    sendFiles(
      "PUT",
      "/api/profile/",
      {
        name: name,
        gender: gender,
        birth_date: birth_date,
        bio: bio,
        profile_picture: profile_picture,
      },
      function (err, res) {
        if (err) return notifyErrorListeners(err);
        console.log(res);
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
        listener(profile);
      });
    });
  }
  module.onProfileUpdate = function (listener) {
    profileListeners.push(listener);
    getProfile(function (err, profile) {
      if (err) return notifyErrorListeners(err);
      listener(profile);
    });
  };

  /////////SURVEY CODE/////////
  // save user profile information
  module.surveySubmit = function (survey_results) {
    send("POST", "/api/survey/", survey_results, function (err, res) {
      if (err) return notifyErrorListeners(err);
      console.log(res);
      //notifySurveyListener();
    });
  };
  //getting user survey
  let getSurvey = function (callback){
    send("GET", "api/survey/", null, callback);
  }

  // function notifySurveyListener() {
  //   getSurveyResponses(function (err, surveyResponse) {
  //     if (err) return notifyErrorListeners(err);
  //     surveyListener.forEach(function (listener) {
  //       listener(surveyResponse);
  //     });
  //   });
  // }
  let surveyListener = [];
  module.onSurveyUpdate = function (listener) {
    surveyListener.push(listener);
    getSurvey(function (err, surveyQuestions) {
      if (err) return notifyErrorListeners(err);
      listener(surveyQuestions);
    });
  };


  //////////ERROR CODE///////////
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
  // for toggling views
  module.toggle_visibility = function (id) {
    console.log("working");
    var elmt = document.getElementById(id);
    if (elmt.style.display == "flex") elmt.style.display = "none";
    else elmt.style.display = "flex";
  };
  return module;
})();
