/**
 * Created by chuclucillo on 29/06/16.
 */
'use strict';
var nconf;
nconf = require("nconf");

nconf.file({ file: './conf.json' });

exports.getAuctions = function() {
    return nconf.get('battlenet-api:baseurl');

};