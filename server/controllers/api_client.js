/**
 * Created by chuclucillo on 29/06/16.
 */
'use strict';
var nconf, http;
nconf = require("nconf");
http = require('http');

nconf.file({ file: './conf.json' });

exports.getAuctions = function(realm) {
    return new Promise(function() {
        var client = http.createClient(80, nconf.get('battlenet-api:baseurl') + '/' + realm + '?locale=' + nconf.get('battlenet-api:locale') + '&apikey=' + nconf.get('battlenet-api:key'));
        var request = client.request();
        request.on('response', function (res) {
            res.on('data', function (data) {
                resolve(data);
            });
        });
        request.end();
    });
};