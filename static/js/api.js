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
  // post request for signing up
  module.signout = function (email, password) {
    send(
      "GET",
      "/signout/",
      null,
      function (err, res) {
        if (err) return notifyErrorListeners(err);
      }
    );
  };

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
      console.log(profile);
      listener(profile);
    });
  };

  /////////SURVEY CODE and Filter Code/////////
  // save user profile information
  module.surveySubmit = function (survey_results) {
    send("POST", "/api/survey/", survey_results, function (err, res) {
      if (err) return notifyErrorListeners(err);
      console.log(res);
      document.querySelector("#profile_survey").innerHTML = "";
      //notifySurveyListener();
    });
  };
   // change users matches based on filters selected
   module.filterSubmit = function (filter_changes) {
    send("PUT", "/api/filters", filter_changes, function (err, res) {
      if (err) return notifyErrorListeners(err);
    });
  };

  //patch request for changing the biography
  module.biographEdit = function (bio){
    send("PUT", "/api/profile/", bio, function (err, res) {
      if (err) return notifyErrorListeners(err);
      //if succesful remove the edit box
      document.getElementById("profile_survey").style.display = "none";
    });
  }

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


  /////////////MATCHES CODE////////////////
  let matchListener = [];
  module.onMatchUpdate = function (listener) {
    matchListener.push(listener);
    getMatches(function (err, matches) {
      if (err) return notifyErrorListeners(err);
      listener(matches);
    });
  };
  // returns all the matches for a given user
  let getMatches = function (callback){
    //send("GET", "/api/matches/", null, callback);
  }
  //add to favourite list
  module.matchLike = function (matchId){
    send("PATCH", "/api/favourites/" + matchId + "/", null, function (err, res) {
      if (err) return notifyErrorListeners(err);
    });
  }
  //remove from match list
  module.matchDislike = function (matchId){
    send("PATCH", "/api/matches/" + matchId + "/", null, function (err, res) {
      if (err) return notifyErrorListeners(err);
    }); 
  }



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
    console.log(document)
    let elmt = document.getElementById(id);
    if (elmt.style.display == "flex") elmt.style.display = "none";
    else {
      elmt.style.display = "flex";
      document.getElementById(id).scrollIntoView();
    }
  };
  return module;
})();
