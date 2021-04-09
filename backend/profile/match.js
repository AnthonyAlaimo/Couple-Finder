/*jshint esversion: 6*/
const database = require("../database/database");

/* Constant containing valid gender strings */
const genders = ["MALE", "FEMALE", "BOTH"];

/* Constant containing required filters */
const requiredFilters = ["lower_age_range", "upper_age_range", "preferred_gender", "smokes"];

/* Constant containing accepted values for match_status */
const match_statuses = ["PENDING", "DISLIKED", "MATCHED"];

/* Logic for matching user profiles */

/* Update filters for user in DB */
function putFilters(req, res, next) {
    // Check for missing fields
    requiredFilters.forEach(x => {
        if (req.body[x] == null) {
            return res.status(400)
            .end("A required field is missing. Please add a value for: " + x + " and try again.");
        }
    });
    // Check preferred gender has acceptable value
    req.body.preferred_gender = req.body.preferred_gender.toLocaleUpperCase("en-US");
    if (!genders.includes(req.body.preferred_gender)) {
        return res.status(400).end("Invalid value for preferred_gender, please choose from: Male, Female, BOTH");
    }

    // Post to database
    let data = {filters: {}};
    data.filters.email = req.email;
    requiredFilters.forEach(x => {
        data.filters[x] = req.body[x];
    });

    database.put("filters/", data, function(resp, isError) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (isError) {
            return res.status(500).end(resp.message);
        }
        return res.json(resp.data.insert_filters_one);
    });
}

/* Request 10 new matches */
function getNewMatches(req, res, next) {
    // Retrieve filter and survey responses for user
    database.get("match-criteria/" + req.email, function(resp, isError) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (isError) {
            return res.status(500).end(resp.message);
        }
        // Construct query criteria
        if (resp.data.profiles.length === 0 || !resp.data.profiles[0].filter) {
            return res.json(null);
        }
        let profile = resp.data.profiles[0];
        let filter = profile.filter;
  
        // Construct match query based on criteria
        let where = `{age: {_gte: ${filter.lower_age_range}, _lte: ${filter.upper_age_range}}`;
        if (filter.preferred_gender !== "BOTH") {
            where += `, gender: {_eq: "${filter.preferred_gender}"}`;
        }
        where += `, smokes_resp: {_lte: ${filter.smokes}}`;
        where += `, email: {_nin: ["${req.email}"`;
        resp.data.matched_already.forEach(match => {
            where += `, "${match.email}"`;
        });
        where += "]}";
        where += `, filter: {lower_age_range: {_lte: ${profile.age}}, upper_age_range: {_gte: ${profile.age}},
                    preferred_gender: {_in: ["${profile.gender}", "BOTH"]}, smokes: {_gte: ${profile.smokes_resp}}}`;
        where += "}";

        // Construct graphQL query
        let find_matches_query = `query find_matches_query {
            profiles(limit: 10, where: ${where}) {
                age
                bio
                email
                foods_resp
                gender
                music_resp
                name
                pets_resp
                personality_resp
                smokes_resp
                traits_resp
                pictures {
                  filename
                  id
                  mimetype
                  path
                  is_profile_picture
                }
            }
        }`;

        // Query for matches
        database.postQuery("find_matches_query", find_matches_query, {}, function(resp, isError) {
            if (resp.isAxiosError) {
                return res.status(resp.response.status).end(resp.response.data.error);
            }
            else if (isError) {
                return res.status(500).end(resp.message);
            }
            return res.json(resp.data.data.profiles);
        });
    });
}

/* Like or dislike a match */
function putMatchRequest(req, res, next) {
    // Check for missing fields
    if (!req.body.invitee || !req.body.status) {
        return res.status(400).end("Improperly formatted request, please fix and try again.");
    }
    let match1 = {inviter: req.email, invitee: req.body.invitee};
    match1.status = req.body.status.toLocaleUpperCase("en-US");
    if (!match_statuses.includes(match1.status)) {
        return res.status(400).end("Impropper value for status. Please select one of: PENDING, DISLIKED, MATCHED and try again.");
    }

    // Query DB to see if the invitee user has also liked the current user
    database.postQuery("get_match_request", get_match_request, {invitee: req.email, inviter: req.body.invitee}, function(resp, isError) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (isError) {
            return res.status(500).end(resp.message);
        }
        let data = [];

        // If match request is found, need to update status of both accordingly
        if (resp.data.data.match_requests.length > 0) {            
            let match2 = resp.data.data.match_requests[0];
            if (match1.status === "DISLIKED" || match2.status === "DISLIKED") {
                match1.status = "DISLIKED";
                match2.status = "DISLIKED";
            }
            else {
                match1.status = "MATCHED";
                match2.status = "MATCHED";
            }
            data.push(match2);
        }
        data.push(match1);

        // Post updated match requests
        database.postQuery("upsert_match_requests", upsert_match_requests, {match_requests: data}, function(resp, isError) {
            if (resp.isAxiosError) {
                return res.status(resp.response.status).end(resp.response.data.error);
            }
            else if (isError) {
                return res.status(500).end(resp.message);
            }
            return res.json(resp.data.data.insert_match_requests.returning);
        });
    });
}

/* Get all pending match and matched profiles */
function getAllMatchRequests(req, res, next) {
    database.get("matches/" + req.email, function(resp, isError) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (isError) {
            return res.status(500).end(resp.message);
        }
        return res.json(resp.data);
    });
}

/* Get favourite matches for the user */
function getFavourites(req, res, next) {
    database.get("favourites/" + req.email, function(resp, isError) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (isError) {
            return res.status(500).end(resp.message);
        }
        return res.json(resp.data.match_requests);
    });
}

/* GraphQL Documents */
const get_match_request = `query get_match_request($invitee: String!, $inviter: String!) {
    match_requests(where: {invitee: {_eq: $invitee}, inviter: {_eq: $inviter}}) {
        invitee
        inviter
        status
    }
}`;

const upsert_match_requests = `mutation upsert_match_requests($match_requests: [match_requests_insert_input!]!) {
    insert_match_requests(objects: $match_requests, on_conflict: {constraint: match_requests_pkey, update_columns: status}) {
        returning {
        invitee
        inviter
        status
        }
    }
}`;

module.exports = {putFilters, getNewMatches, putMatchRequest, getAllMatchRequests, getFavourites};