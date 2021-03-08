/*jshint esversion: 6 */
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("frontend"));
//https server
const http = require("http");
const PORT = process.env.PORT || 3000;

http.createServer(app).listen(PORT, function (err) {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
// const https = require("https");
// const PORT = process.env.PORT || 3000;

// var privateKey = fs.readFileSync("server.key");
// var certificate = fs.readFileSync("server.crt");
// var config = {
//   key: privateKey,
//   cert: certificate,
// };

// https.createServer(config, app).listen(PORT, function (err) {
//   if (err) console.log(err);
//   else console.log("HTTPS server on https://localhost:%s", PORT);
// });
