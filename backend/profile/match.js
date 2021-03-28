/*jshint esversion: 6*/
const { Worker } = require('worker_threads');


/* Logic for matching user profiles */

/* Subscribe to profile update. Vectorizes the user profile whenever it is updated */
function vectorizeProfile(profile) {
    let worker = new Worker("./workers/vectorize_profile.js");
    worker.postMessage(profile);
    worker.on("message", (output) => console.log(output));
    worker.on("error", (error) => console.log(error));
}

module.exports = {vectorizeProfile};