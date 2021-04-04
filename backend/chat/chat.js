/*jshint esversion: 6*/
const socket = require("socket.io");

/* Module for text chatting between users */
const SOCKET_LIST = {};

function initialize (server) {
    let io = socket(server);
    io.sockets.on("connection", function(socket) {
        console.log("New User!");
        let socketId = Math.random();
        SOCKET_LIST[socketId] = socket; 
        socket.on("sendMsg", function(data) {
            console.log(data);
        });
    });
}

module.exports = {initialize};