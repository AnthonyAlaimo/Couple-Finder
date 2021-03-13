/*jshint esversion: 6*/
const crypto = require('crypto');
const database = require('../database/database');

/* Object Constructors */
function User(email, password, salt) {
    this.email = email;
    this.password = password;
    this.salt = salt;
}

/**
 * Sign up new user
 */
function signup(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    // Determine if user already exists
    database.get("login/" + email, function(resp) {  
        if (resp.isAxiosError) {
            return res.status(resp.response.status).end(resp.response.data.error);
        }
        else if (resp.data.users.length > 0) {
            return res.status(400).end("Invalid request, email is already in use.");
        }
        // Hash and Salt Password and store in DB
        let salt = crypto.randomBytes(16).toString("base64");
        let hash = crypto.createHmac("sha512", salt);
        hash.update(password);
        database.post("signup", {user: new User(email, hash.digest("base64"), salt)}, function(resp) {
            if (resp.isAxiosError) {
                return res.status(resp.response.status).end(resp.response.data.error);
            }
            else {
                req.session.email = email;
                return res.sendStatus(200);
            }
        });
    });
}

/**
 * Sign in existing user
 */
function signin(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  // Find and match user in database
  database.get("login/" + email, function (resp) {
    if (resp.isAxiosError) {
        return res.status(resp.response.status).end(resp.response.data.error);
    }
    else if (resp.data.users.length == 0) {
        return res.status(401).end("Incorrect login credentials");
    }
    // Compare salted hash to authenticate user
    let user = resp.data.users[0];
    let salt = user.salt;
    let hash = crypto.createHmac("sha512", salt);
    hash.update(password);
    if (user.password !== hash.digest("base64")) {
        return res.status(401).end("Incorrect login credentials");
    }
    // Setup session and cookies
    req.session.email = email;
    return res.sendStatus(200);
  });
}

/**
 * Sign out currently authenticated user
 */
function signout(req, res, next) {
  req.session.destroy();
  return res.sendStatus(200);
}

module.exports = {signin, signup, signout};