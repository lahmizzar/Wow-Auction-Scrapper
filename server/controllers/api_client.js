/**
 * Created by chuclucillo on 29/06/16.
 */
'use strict';
var nconf, peticiones;
nconf = require("nconf");
peticiones = require("../aux/peticiones");

nconf.file({ file: './conf.json' });

exports.getAuctions = function() {
    return peticiones.peticionSSL('/auction/data');
};