/*jshint esversion: 6*/
const axios = require('axios');

/* Module for accessing and querying data from a HASURA graphQL database */
const databaseUrl = process.env.DATABASE_URL;
const adminSecret = process.env.DATABASE_KEY;
function get(url, callback) {
    let config = {
        headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": adminSecret
        }
    };
    axios.get(databaseUrl + url, config).then((resp) => callback(resp, false))
        .catch((err) => callback(err, true));
}

function post(url, data, callback) {
    let config = {
        headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": adminSecret
        }
    };
    axios.post(databaseUrl + url, data, config).then((resp) => callback(resp, false))
    .catch((err) => callback(err, true));
}

function put(url, data, callback) {
    let config = {
        headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": adminSecret
        }
    };
    axios.put(databaseUrl + url, data, config).then((resp) => callback(resp, false))
    .catch((err) => callback(err, true));
}

module.exports = {get, post, put};