/*jshint esversion: 6*/
const axios = require('axios');

/* Module for accessing and querying data from a HASURA graphQL database */
const databaseUrl = process.env.DATABASE_URL || "https://tidy-eft-67.hasura.app/api/rest/";
const adminSecret = process.env.DATABASE_KEY || "B5HMmWK6oSQ3ABb0Jm88QlwLTosgYKm9YpKjikTj2z8h18IlSwACYS4hPluiy1ly";

function get(url, callback) {
    let config = {
        headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": adminSecret
        }
    };
    axios.get(databaseUrl + url, config).then((resp) => callback(resp))
        .catch((err) => callback(err));
}

function post(url, data, callback) {
    let config = {
        headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": adminSecret
        }
    };
    axios.post(databaseUrl + url, data, config).then((resp) => callback(resp))
    .catch((err) => callback(err));
}

function put(url, data, callback) {
    let config = {
        headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": adminSecret
        }
    };
    axios.put(databaseUrl + url, data, config).then((resp) => callback(resp))
    .catch((err) => callback(err));
}

module.exports = {get, post, put};