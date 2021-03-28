/*jshint esversion: 6*/
const { parentPort } = require('worker_threads');

parentPort.on("message", message => {
    parentPort.postMessage(message);
});
