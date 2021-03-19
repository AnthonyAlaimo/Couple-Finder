/*jshint esversion: 6 */
(function () {
  "use strict";

  window.addEventListener("load", function () {
    //error checking
    api.onError(function (err) {
      console.error("[error]", err);
      if  (err === "[401]Access Denied"){
        window.location.href = "/";
      }
    });

    api.onError(function (err) {
      var error_box = document.querySelector("#error_box");
      error_box.innerHTML = err;
      error_box.style.visibility = "visible";
    });
    api.onProfileUpdate(function (user) {
      document.querySelector("#profile").innerHTML = "";
      let userElmt = document.createElement("div");
      userElmt.innerHTML = `
        <img class="img" src="/api/pictures/${user.pictures[0].id}/picture/" alt="Image can't be displayed, please try another URL">
        <h1 class="name">${user.name} </h1>
        <h3 class="birth_date">${user.age} </h3>
        <h3 class="gender">${user.gender} </h3>
        <h3 class="bio">${user.bio} </h3>
          `;
      if (!user) {
          window.location.href = "/";
      }
      if (user){
        document.getElementById("profile_setup").style.display = "none";
      }
      // add this element to the document
      document.querySelector("#profile").prepend(userElmt);
    });
    api.onSurveyUpdate(function (survey){
      let surveyElmt = document.createElement("div");
      surveyElmt.className = "survey_element"
      // create html element for survey
      survey.forEach(function (question){
        //add question to survey
        surveyElmt.innerHTML += `<h2>${question.question_text}</h2>`
        question.survey_options.forEach(function (option){
          //add option to survey
          surveyElmt.innerHTML += `
          <input id="${option.answer_text}" value="${option.answer_text}" type="radio" name="${question.question_text}" class="survey_option">${option.answer_text}</input>
          `;
          // add survey to document
        })
      })
      document.querySelector('#survey').prepend(surveyElmt)
    })

    // submitting survey result to server
    document
      .querySelector("#survey_submit")
      .addEventListener("submit", function (e) {
        let r1 = Array.from(document.querySelectorAll('#survey_submit input'))
        let result = []
        r1.forEach(function (option){
          if (option.checked === true){
            result.push(option.defaultValue)
          }
        })
        console.log(result);
        api.surveySubmit(result);
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
