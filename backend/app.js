/*jshint esversion: 6*/

/* Node Modules */
const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");

const upload = multer({dest: path.join(__dirname, "uploads"), limits: {fileSize: "4MB"}});
const http = require("http");
const crypto = require("crypto");
const validator = require('validator');
const helmet = require('helmet');

app.use(helmet());

const session = require("express-session");
app.use(
  session({
    saveUninitialized: false,
    secret: crypto.randomBytes(16).toString("base64"),
    resave: false,
    cookie: {httpOnly: true, sameSite: true}
  })
);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static("../frontend/build", {redirect: false}));

/* Local Modules */
const login = require("./authentication/login");
const profile = require("./profile/profile");
const survey = require("./profile/survey");
const match  = require("./profile/match");

const PORT = process.env.PORT;

/* Create underlying http server. 
*  When deployed Heroku will wrap it in a proxy https server so all routes will be https */
let server = http.createServer(app).listen(PORT, function (err) {
	if (err) console.log(err);
	else {
	console.log("Server listening on port " + PORT);
	}
});

/* Initial handler, obtains email from session if one exists */
app.use(function (req, res, next) {
	req.email = req.session.email ? req.session.email : null;
	next();
});

/* Create */

/* Sign up new user */
app.post("/api/signup/", validateEmail, function (req, res, next) {
	login.signup(req, res, next);
});

/* Sign in existing user */
app.post("/api/signin/", validateEmail, function (req, res, next) {
	login.signin(req, res, next);
});

/* Post profile for current user */
app.post("/api/profile/", isAuthenticated, upload.single("profile_picture"), function(req, res, next) {
	profile.postUserProfile(req, res, next);
});

/* Read */

/* Sign out currently authenticated user */
app.get("/api/signout/", function (req, res, next) {
	login.signout(req, res, next);
});

/* Get static survey questions and answers */
app.get("/api/survey/", isAuthenticated, function (req, res, next) {
	survey.getSurvey(req, res, next);
});

/* Get profile for current user */
app.get("/api/profile/", isAuthenticated, function (req, res, next) {
	profile.getUserProfile(req, res, next);
});

/* Gets image file for specified image */
app.get("/api/pictures/:id/picture/", isAuthenticated, function (req, res, next) {
	profile.getPictureFile(req, res, next);
});

/* Get at most 10 matches based on user's filters */
app.get("/api/new-matches/", isAuthenticated, function (req, res, next) {
	match.getNewMatches(req, res, next);
});

/* Get incoming and outgoing match requests for the user */
app.get("/api/matches/", isAuthenticated, function (req, res, next) {
    match.getAllMatchRequests(req, res, next);
});

/* Get favourite matches for the user */
app.get("/api/favourites/", isAuthenticated, function(req, res, next) {
	match.getFavourites(req, res, next);
});

/* Update */

/* Create or update filters for the user */
app.put("/api/filters/", isAuthenticated, function(req, res, next) {
	match.putFilters(req, res, next);
});

/* Create or update survey responses for current user */
app.put("/api/survey/", isAuthenticated, function (req, res, next) {
	survey.putSurveyResponses(req, res, next);
});

/* Like or dislike a potential profile */
app.put("/api/match/", isAuthenticated, function (req, res, next) {
	match.putMatchRequest(req, res, next);
});

/* Delete */

app.use("/", function (req, res, next){
	res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Determines if user is authenticated
function isAuthenticated(req, res, next) {
    if (!req.email) {
        return res.status(401).end("Access Denied");
    }
    next();
}

/* Validation for requests */
function validateEmail(req, res, next) {
	req.body.email = req.body.email ? req.body.email : "";
	if (!validator.isEmail(req.body.email)) {
		return res.status(400).end("Please enter a valid email");
	}
	next();
}