/*jshint esversion: 6*/
const database = require("../database/database");
const fs = require("fs");

/* Logic for getting and updating user profiles */

/* Gets the user profile for the currently logged in user */
function getUserProfile(req, res, next) {
    // Query database
    database.get("profile/" + req.email, function(resp, isError) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (isError) {
            return res.status(500).end(resp.message);
        }
        else if (resp.data.profiles.length == 0) {
            return res.json(null);
        }
        let profile = resp.data.profiles[0];
        profile.age = calculateAge(profile.birthday);
        delete profile.birthday;
        return res.json(profile);
    });
}

/* Updates current user's profile */
function updateUserProfile(req, res, next) {
    // Query database to determine if profile already exists.
    database.get("profile/" + req.email, function(resp, isError) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (isError) {
            return res.status(500).end(resp.message);
        }
        // If profile already exists, only allow modification of certain fields
        else if (resp.data.profiles.length > 0) {
            database.put("profile/", {profile: {email: req.email, bio: req.body.bio}}, function(resp, isError) {
                if (resp.isAxiosError) {
                    return res.status(resp.response.status).end(resp.response.data.error);
                }
                else if (isError) {
                    return res.status(500).end(resp.message);
                }
                let profile = resp.data.insert_profiles_one;
                profile.age = calculateAge(profile.birthday);
                delete profile.birthday;
                return res.json(profile);
            });
        }
        // Else allow modification of all fields
        else {
            // Check for missing fields
            if (!req.file || !req.body.name || !req.body.birth_date || !req.body.gender) {
                return res.status(400)
                .end("A required field is missing, please fix request and try again.");
            }
            let data = {profile: {
                email: req.email,
                name: req.body.name,
                birthday: req.body.birth_date,
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
            database.put("profile/", data, function(resp, isError) {
                if (resp.isAxiosError) {
                    return res.status(resp.response.status).end(resp.response.data.error);
                }
                else if (isError) {
                    return res.status(500).end(resp.message);
                }
                let profile = resp.data.insert_profiles_one;
                profile.age = calculateAge(profile.birthday);
                delete profile.birthday;
                return res.json(profile);
            });
        }
    });
}

function getPictureFile(req, res, next) {
    // Query database for picture
    database.get("pictures/" + req.params.id, function(resp, isError) {
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (isError) {
            return res.status(500).end(resp);
        }
        else if (resp.data.pictures.length == 0) {
            return res.status(404).end("No picture with given id could be found");
        }
        let picture = resp.data.pictures[0];
        // Check file exists on fs
        if (fs.existsSync(picture.path)) {
            res.setHeader("Content-Type", picture.mimetype);
            res.sendFile(picture.path);
        }
        else {
            return res.status(404).end("No file for the given picture could be found");
        }
    });
}

function calculateAge(birthday) {
    // From https://stackoverflow.com/questions/4060004/calculate-age-given-the-birth-date-in-the-format-yyyymmdd/7091965#7091965
    var today = new Date();
    var birthdate = new Date(birthday);
    var age = today.getFullYear() - birthdate.getFullYear();
    var m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
}

module.exports = {getUserProfile, updateUserProfile, getPictureFile};