/*jshint esversion: 6*/
const database = require("../database/database");

/* Module for managing the initial signup survey */
const questionMapping = ["personality_resp", "traits_resp", "music_resp", "foods_resp", "pets_resp", "smokes_resp"];

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
    // Convert from {question_number, answer_number} into corresponding column in profiles table
    let data = {};
    questionMapping.forEach(x => {
        data[x] = req.body[x];
    });
    database.put("survey/" + req.email, data, function(resp, isError) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (isError) {
            return res.status(500).end(resp.message);
        }
        return res.json(resp.data.update_profiles_by_pk);
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

module.exports = {getSurvey, postSurveyResponses};