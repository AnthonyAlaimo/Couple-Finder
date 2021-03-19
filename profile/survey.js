/*jshint esversion: 6*/
const database = require("../database/database");

/* Module for managing the initial signup survey */

/* Survey questions from https://www.jotform.com/form/210715626685258 */

/* Get survey questions and answers */
function getSurvey(req, res, next) {
    database.get("survey/", function(resp) {
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
    database.put("survey/" + req.email, data, function(resp) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (isError) {
            return res.status(500).end(resp.message);
        }
        return res.json(resp.data.returning);
    });
}

/* Get survey responses for user */
function getSurveyResponses(req, res, next) {
    database.get("survey/" + req.email, function(resp) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (isError) {
            return res.status(500).end(resp.message);
        }
        return res.json(resp.data.survey_responses);
    });
}

module.exports = {getSurvey, postSurveyResponses, getSurveyResponses};