/*jshint esversion: 6*/
const database = require("../database/database");

/* Gets the user profile for the currently logged in user */
function getUserProfile(req, res, next) {
    // Query database
    database.get("/profile/" + req.email, function(resp) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (resp.data.users.length == 0) {
            return res.status(404).end("No profile for the specified user could be found.");
        }
        return res.json(resp.response.data);
    });
}

/* Updates current user's profile */
function updateUserProfile(req, res, next) {
    // Query database to determine if profile already exists.
    database.get("/profile/" + req.email, function(resp) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        // If profile already exists, only allow modification of certain fields
        else if (resp.data.users.length > 0) {
            database.put("/profile/" + req.email, {profile: {bio: req.body.bio}});
        }
    });
}

module.exports = {getUserProfile, updateUserProfile};