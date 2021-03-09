/*jshint esversion: 6 */
const http = require("http");
const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "path")));
app.get("/*", (req, res) => res.sendFile(path.join(__dirname)));
// Create the server on the specified port
const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, () =>
  console.log(`Server running on: http://localhost:${port}`)
);
