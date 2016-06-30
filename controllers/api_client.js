/**
 * Created by chuclucillo on 29/06/16.
 */
'use strict';

exports.getAuctions = function() {
    return nconf.get('battlenet-api:baseurl');

};