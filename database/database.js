/*jshint esversion: 6*/
const axios = require('axios');

const databaseUrl = process.env.DATABASE_URL;
const adminSecret = process.env.DATABASE_KEY;

function get(url, callback) {
    let config = {
        headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": adminSecret
        }
    };
    axios.get(databaseUrl + url, config).then((resp) => callback(resp))
        .catch(function(err) {
            callback(err);
        });
}

function post(url, data, callback) {
    let config = {
        headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": adminSecret
        }
    };
    axios.post(databaseUrl + url, data, config).then((resp) => callback(resp))
    .catch(function (err) {
        callback(err);
    });
}

module.exports = {get, post};