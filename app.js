/*jshint esversion: 6*/

/* Node Modules */
const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");

const upload = multer({ dest: path.join(__dirname, "uploads") });
const http = require("http");
const fs = require("fs");
const crypto = require("crypto");
const validator = require('validator');
const helmet = require('helmet');

app.use(helmet());

const session = require("express-session");
app.use(
  session({
    secret: crypto.randomBytes(16).toString("base64"),
    resave: false,
    saveUninitalized: true,
    cookie: {httpOnly: true, sameSite: true, secure: true}
  })
);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("static"));

/* Local Modules */
const login = require("./authentication/login");
const profile = require("./profile/profile");
const survey = require("./profile/survey");

const PORT = process.env.PORT || 3000;

http.createServer(app).listen(PORT, function (err) {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});

/* Redirects HTTP requests to HTTPS */
// From https://stackoverflow.com/questions/24726779/using-https-on-heroku
app.all("*", function (req, res, next) {
  if (process.env.PORT && req.headers["x-forwarded-proto"] != "https") {
    res.redirect("https://" + req.headers.host + req.url);
  } else {
    next();
  }
});

/* Initial handler, obtains email from session if one exists */
app.use(function (req, res, next) {
  req.email = req.session.email ? req.session.email : null;
  next();
});

/* Create */

/**
 * Sign up new user
 */
app.post("/signup/", function (req, res, next) {
  login.signup(req, res, next);
});

/**
 * Sign in existing user
 */
app.post("/signin/", function (req, res, next) {
  login.signin(req, res, next);
});

/* Post survey responses for current user */
app.post("/api/survey/", isAuthenticated, function (req, res, next) {
  survey.postSurveyResponses(req, res, next);
});

/* Read */

/**
 * Sign out currently authenticated user
 */
app.get("/signout/", function (req, res, next) {
  login.signout(req, res, next);
});


app.get("api/survey/", isAuthenticated, function (req, res, next) {
  survey.getSurvey(req, res, next);
});

/**
 * Get profile for current user
 */
app.get("/api/profile/", isAuthenticated, function (req, res, next) {
    profile.getUserProfile(req, res, next);
});

/* Gets image file for specified image */
app.get("/api/pictures/:id/picture/", isAuthenticated, function (req, res, next) {
  profile.getPictureFile(req, res, next);
});

/* Get survey responses for current user */
app.get("/api/survey/response", isAuthenticated, function (req, res, next) {
  survey.getSurveyResponses(req, res, next);
});

/* Update */

/* Update profile for current user */
app.put("/api/profile/", isAuthenticated, upload.single("profile_picture"), function(req, res, next) {
  profile.updateUserProfile(req, res, next);
});

/* Delete */

// Determines if user is authenticated
function isAuthenticated(req, res, next) {
    if (!req.email) {
        return res.status(401).end("Access Denied");
    }
    next();
}

/* Validation for requests */
function validateEmail(req, res, next) {
  if (!validator.isEmail(req.body.email)) {
    return res.status(400).end("Please enter a valid email");
  }
  next();
}

function sanitizeUserInput(req, res, next) {
  req.body.bio = validator.escape(req.body.bio);
  next();
}