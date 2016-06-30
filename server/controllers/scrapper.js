/**
 * Created by chuclucillo on 30/06/16.
 */
'use strict';
var cron, api_client, cron_auctions, status, nconf;
cron = require('node-cron');
nconf = require("nconf");
api_client = require('./api_client');
cron_auctions = null;
status = 'stopped';

nconf.file({ file: './conf.json' });

exports.initSchedules = function() {
    status = 'running';
    cron_auctions = cron.schedule(nconf.get('intervals:notify'), task_auctions);
};
exports.statusSchedules = function() { return status};
exports.pauseSchedules = function() {
    if(cron_auctions!=null) {
        status = 'paused'; 
        cron_auctions.stop();
    }
};
exports.resumeSchedules = function() {
    if(cron_auctions!=null) {
        status = 'running';
        cron_auctions.start();
    }
};
exports.stopSchedules = function (){
    if(cron_auctions!=null) {
        status = 'stopped';
        cron_auctions.destroy();
    }
};
var task_auctions = function() {
    console.log(api_client.getAuctions());
};

