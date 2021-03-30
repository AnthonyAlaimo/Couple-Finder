/*jshint esversion: 6*/
const database = require("../database/database");

/* Constant containing valid gender strings */
const genders = ["MALE", "FEMALE", "BOTH"];

/* Constant containing required filters */
const requiredFilters = ["lower_age_range", "upper_age_range", "preferred_gender", "smokes"];

/* Constant containing self match fields */
const selfMatchFields = ["foods_resp", "music_resp", "personalit_resp", "pets_resp", "traits_resp"];

/* Logic for matching user profiles */

/* Update filters for user in DB */
function updateFilters(req, res, next) {
    // Check for missing fields
    console.log(req.body);
    requiredFilters.foreach(x => {
        if (req.body[x] == null) {
            return res.status(400)
            .end("A required field is missing. Please add a value for: " + x + " and try again.");
        }
    });
    // Check preferred gender has acceptable value
    req.body.preferred_gender = req.body.preferred_gender.toLocaleUpperCase("en-US");
    if (!genders.includes(req.body.preferred_gender)) {
        return res.status(400).end("Invalid value for preferred_gender, please choose from: Male, Female, Both");
    }

    // Post to database
    let data = {filters: req.body};
    data.filters.email = req.email;
    database.put("filters/", data, function(resp, isError) {
        if (isError) {
            let result = resp.isAxiosError ? 
                res.status(resp.response.status).end(resp.response.data.error) :
                res.status(500).end(resp.message);
            return result;
        }
        return res.json(resp.data.insert_filters_one);
    });
}

/* Request 10 new matches */
function getNewMatches(req, res, next) {
    // Retrieve filter and survey responses for user
    database.get("match-criteria/" + req.email, function(resp, isError) {
        if (isError) {
            let result = resp.isAxiosError ? 
                res.status(resp.response.status).end(resp.response.data.error) :
                res.status(500).end(resp.message);
            return result;
        }
        // Construct query criteria
        if (resp.data.profiles.length === 0 || resp.data.profiles[0].filters.length === 0) {
            return res.json(null);
        }
        let profile = resp.data.profiles[0];
        let filter = profile.filters[0];
        console.log(profile);
        // Construct match query based on criteria
        let where = `{age: {_gte: ${filter.lower_age_range}, _lte: ${filter.upper_age_range}}`;
        if (filter.preferred_gender !== "BOTH") {
            where += `, gender: {_eq: ${filter.preferred_gender}}`;
        }
        where += `, smokes_resp: {_lte: ${filter.smokes}}`;

        selfMatchFields.foreach(x => {
            where += `, ${x}: {_eq: ${profile[x]}}`;
        });
        where += "}";

        // Construct graphQL query
        let find_matches_query = `query find_matches_query {
            profiles(limit: 10, offset: where: ${where}) {
                age
                foods_resp
                gender
                music_resp
                personality_resp
                pets_resp
                smokes_resp
                traits_resp
                name
                bio
                email
                filters {
                    lower_age_range
                    preferred_gender
                    smokes
                    upper_age_range
                }
            }
        }`;

        // Query for matches
        database.postQuery("find_matches_query", find_matches_query, {}, function(resp, isError) {
            if (isError) {
                let result = resp.isAxiosError ? 
                    res.status(resp.response.status).end(resp.response.data.error) :
                    res.status(500).end(resp.message);
                return result;
            }
            return res.json(resp.data.find_matches_query);
        });
    });
}

/* Like or dislike a match */
function postMatchRequest(req, res, next) {
    // Check for missing fields
    if (!req.body.invitee || !req.body.status) {
        return res.status(400).end("Inproperly formatted request, please fix and try again.");
    }
    let data = {};
    data.invitee = req.body.invitee;
    data.status = req.body.status;
    database.post("matches/" + req.email, data, function(resp, isError) {
        if (isError) {
            let result = resp.isAxiosError ? 
                res.status(resp.response.status).end(resp.response.data.error) :
                res.status(500).end(resp.message);
            return result;
        }
        return res.json(resp.data.insert_match_requests_one);
    });
}

/* Get all pending match and matched profiles */
function getMatchRequests(req, res, next) {
    database.get("matches/" + req.email, function(resp, isError) {
        if (isError) {
            let result = resp.isAxiosError ? 
                res.status(resp.response.status).end(resp.response.data.error) :
                res.status(500).end(resp.message);
            return result;
        }
        return res.json(resp.data.match_requests);
    });
}

module.exports = {updateFilters, getNewMatches, postMatchRequest, getMatchRequests};