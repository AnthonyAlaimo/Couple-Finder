/*jshint esversion: 6*/
const database = require("../database/database");

/* Constant containing valid gender strings */
const genders = ["MALE", "FEMALE", "BOTH"];

/* Logic for matching user profiles */

function updateFilters(req, res, next) {
    // Check for missing fields
    if (!req.body.lower_age_range || !req.body.upper_age_range || !req.body.preferred_gender ||
         !req.body.question_three_answer || !req.body.question_four_answer || !req.body.question_five_answer ||
         !req.body.question_six_answer) {
            return res.status(400)
            .end("A required field is missing, please fix request and try again.");
         }
    // Check preferred gender has acceptable value
    req.body.preferred_gender = req.body.preferred_gender.toLocaleUpperCase("en-US");
    if (!genders.includes(req.body.preferred_gender)) {
        return res.status(400).end("Invalid value for preffered_gender, please choose from: Male, Female, Both");
    }

    // Post to database
    let data = {filters: req.body};
    data.filters.email = req.email;
    database.put("filters", data, function(resp, isError) {
        if (isError) {
            let result = resp.isAxiosError ? 
                res.status(resp.response.status).end(resp.response.data.error) :
                res.status(500).end(resp.message);
            return result;
        }
        return res.json(resp.data.insert_filters_one);
    });
}

module.exports = {updateFilters};