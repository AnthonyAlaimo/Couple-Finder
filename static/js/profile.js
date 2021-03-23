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
      error_box.style.visibility = "visible";
    });

    api.onError(function (err) {
      var error_box = document.querySelector("#error_box");
      error_box.innerHTML = err;
      error_box.style.visibility = "hidden";
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
        <form id="bio_edit">
          <textarea
            id="profile_bio"
            placeholder="Enter Your New Biography HERE"
            ></textarea>
          <button type="submit" class="btn">Submit</button>
        </form>
          `;
      if (!user) {
          window.location.href = "/";
      }
      if (user){
        document.getElementById("profile_setup").style.display = "none";
      }
      // add this element to the document
      document.querySelector("#profile").prepend(userElmt);
      //for editting biography
      document.querySelector("#bio_edit").addEventListener("submit", function (e) {
        console.log("OKAY")
        //api.editBiography();
      });
      // toggle bio edit
      document.querySelector("#profile_edit_btn").addEventListener("click", function (e) {
        api.toggle_visibility("bio_edit");
      });
    });
    //display survey for user to fill out
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
          <input id="${option.answer_text}" value="${question.question_number} ${option.answer_number}" type="radio" name="${question.question_number}" class="${question.question_text}">${option.answer_text}</input>
          `;
          // add survey to document
        })
      })
      document.querySelector('#survey').prepend(surveyElmt)
    })
    //display the response for a users survey
    // api.onSurveyResultUpdate(function (survey_results){
    //   let responseElmt = document.createElement("div");
    //   responseElmt.className = "survey_element"
    //   // create html element for survey
    //   survey_results.forEach(function (result){
    //     responseElmt.innerHTML += `<h2>${result}</h2>`
    //   })
    //   document.querySelector('#survey_result').prepend(surveyElmt)
    // });
    // submitting survey result to server
    document
      .querySelector("#survey_submit")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        let responseElmt = document.createElement("div");
        responseElmt.className = "survey_element"
        let r1 = Array.from(document.querySelectorAll('#survey_submit input'))
        console.log(r1);
        let result = [];
        let questionNum;
        let answerNum;
        r1.forEach(function (option){
          if (option.checked === true){
            console.log(option.className);
            responseElmt.innerHTML += `<h1>${option.className}</h1>`
            responseElmt.innerHTML += `<p>${option.id}</p>`
            questionNum = option.defaultValue.slice(0,1)
            answerNum = option.defaultValue.slice(2,3)
            result.push({question_number: parseInt(questionNum), answer_number: parseInt(answerNum)})
          }
        })
        console.log(result);
        console.log(responseElmt);
        document.querySelector('#survey_result').prepend(responseElmt)
        document.getElementById("profile_survey").style.display = "none";
        api.surveySubmit(result);
    });

    // submitting filter configuration for given user
    // document
    //   .querySelector("#filter_submit")
    //   .addEventListener("submit", function (e) {
    //     e.preventDefault();
    //     let r1 = Array.from(document.querySelectorAll('#filter_submit input'))
    //     let result = [];
    //     let questionNum;
    //     let answerNum;
    //     r1.forEach(function (option){
    //       if (option.checked === true){
    //         questionNum = option.defaultValue.slice(0,1)
    //         answerNum = option.defaultValue.slice(2,3)
    //         result.push({filter_number: parseInt(questionNum), answer_number: parseInt(answerNum)})
    //       }
    //     })       
    //     //document.getElementById("profile_survey").style.display = "none";
    //     api.filterSubmit(result);
    // });
    //for signing out
    document.querySelector("#signout_button").addEventListener("click", function (e) {
      api.signout();
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
    // toggle filters
    document.querySelector("#filters").addEventListener("click", function (e) {
      api.toggle_visibility("profile_filters");
    });
  });
})();
