/*jshint esversion: 6*/
const database = require("../database/database");

/* Logic for getting and updating user profiles */

/* Gets the user profile for the currently logged in user */
function getUserProfile(req, res, next) {
    // Query database
    database.get("/profile/" + req.email, function(resp) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (resp.data.profiles.length == 0) {
            return res.json(null);
        }
        return res.json(resp.data.profiles[0]);
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
        // Else allow modification of all fields
        else {
            // Check for missing fields
            if (!req.file || !req.body.name || !req.body.age || !req.body.gender) {
                return res.status(400)
                .end("A required field is missing, please fix request and try again.");
            }
        }
    });
}

module.exports = {getUserProfile, updateUserProfile};