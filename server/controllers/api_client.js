/**
 * Created by chuclucillo on 29/06/16.
 */
'use strict';
var nconf, requests;
nconf = require("nconf");
requests = require("../aux/requests");

nconf.file({ file: './conf.json' });

exports.getAuctions = function() {
    return requests.requestSSL('/auction/data');
};