/*jshint esversion: 6*/
const database = require("../database/database");

/* Logic for getting and updating user profiles */

/* Gets the user profile for the currently logged in user */
function getUserProfile(req, res, next) {
    // Query database
    database.get("profile/" + req.email, function(resp) {
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
    database.get("profile/" + req.email, function(resp) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        // If profile already exists, only allow modification of certain fields
        else if (resp.data.profiles.length > 0) {
            database.put("profile/", {profile: {email: req.email, bio: req.body.bio}}, function(resp) {
                if (resp.isAxiosError) {
                    return res.status(resp.response.status).end(resp.response.data.error);
                }
                res.json(resp.data.insert_profiles_one);
            });
        }
        // Else allow modification of all fields
        else {
            // Check for missing fields
            if (!req.file || !req.body.name || !req.body.age || !req.body.gender) {
                return res.status(400)
                .end("A required field is missing, please fix request and try again.");
            }
            let data = {profile: {
                email: req.email,
                name: req.body.name,
                age: Number(req.body.age),
                gender: req.body.gender,
                bio: req.body.bio,
                pictures: {data: [
                    {
                        path: req.file.path,
                        mimetype: req.file.mimetype,
                        filename: req.file.filename,
                        is_profile_picture: true
                    }
                ]}
            }};
            database.put("profile/", data, function(resp) {
                if (resp.isAxiosError) {
                    return res.status(resp.response.status).end(resp.response.data.error);
                }
                res.json(resp.data.insert_profiles_one);
            });
        }
    });
}

function getPictureFile(req, res, next) {
    // Query database for picture
    database.get("pictures/" + req.params.id, function(resp) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (resp.data.pictures.length == 0) {
            return res.status(404).end("No picture with given id could be found");
        }
        let picture = resp.data.pictures[0];
        res.setHeader("Content-Type", picture.mimetype);
        res.sendFile(picture.path);
    });
}

module.exports = {getUserProfile, updateUserProfile, getPictureFile};