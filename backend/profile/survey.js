/*jshint esversion: 6*/
const database = require("../database/database");

/* Module for managing the initial signup survey */

/* Survey questions from https://www.jotform.com/form/210715626685258 */

/* Get survey questions and answers */
function getSurvey(req, res, next) {
    database.get("survey/", function(resp, isError) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (isError) {
            return res.status(500).end(resp.message);
        }
        return res.json(resp.data.survey_questions);
    });
}

/* Post survey responses to database */
function postSurveyResponses(req, res, next) {
    // Format survey responses into list of {email, question_number, answer_number}
    let data = {survey_responses: req.body};
    data.survey_responses.forEach(x => {
        x.email = req.email;
    });

    database.postQuery("upsert_survey_responses", upsert_survey_responses, data, function(resp, isError) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (isError) {
            return res.status(500).end(resp.message);
        }
        return res.json(resp.data.data.insert_survey_responses.returning);
    });
}

/* Get survey responses for user */
function getSurveyResponses(req, res, next) {
    database.get("survey/" + req.email, function(resp, isError) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (isError) {
            return res.status(500).end(resp.message);
        }
        return res.json(resp.data.survey_responses);
    });
}

/* Graphql documents */
const upsert_survey_responses = `
mutation upsert_survey_responses($survey_responses: [survey_responses_insert_input!]!) {
  insert_survey_responses(on_conflict: {constraint: survey_responses_pkey, update_columns: answer_number}, objects: $survey_responses) {
    returning {
      answer_number
      question_number
    }
  }
}
`;

module.exports = {getSurvey, postSurveyResponses, getSurveyResponses};