/*jshint esversion: 6*/
const socket = require("socket.io");
const connections = [];
const session = require("express-session");

function initialize (server) {
    let io = socket(server);
    // io.use(wrap(session({ secret: "cats" })));
    io.use(session({ secret: "cats" }));

    io.use(async (socket, next) => {
        const session = socket.request.session;
        if (session.username) {
            socket.username = username;
            next();
        }
        throw Error('Not authenticated');
    });
    io.sockets.on('connection', socket => {
        // socket represents a client instance, more specifically "yours"
        connections.push(socket);
    
        // START OF INIT WHEN JOINING
        socket.broastcast.emit('new user', { username: socket.username });
    
        // RELAYING INFORMATION
    
        // When on the frontend, "you" emit something
        socket.on('message', ({ to, message }) => {
            // This is sending it back to "you"
            // socket.emit('message', message);
    
            // This is for everyone in the server
            // socket.broadcast.emit('message', message);
    
            // Send this to one specific person
            const _socket = connections.find(connection => connection.username === to);
            if (_socket) {
                _socket.emit('message', message);
            }
        });
    
        socket.on('disconnect', () => {
            const index = connections.indexOf(socket);
            connections.splice(index, 1);
            socket.broadcast.emit('bye user', { username: socket.username });
        });
    });
    
}

module.exports = {initialize};