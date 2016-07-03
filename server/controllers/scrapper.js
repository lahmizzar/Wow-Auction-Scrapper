/**
 * Created by chuclucillo on 30/06/16.
 */
'use strict';
var cron, api_client, cron_auctions, status, nconf, requests, auctionsCtrl;
cron = require('node-cron');
nconf = require("nconf");
api_client = require('./api_client');
requests = require('../aux/peticiones');
cron_auctions = null;
status = 'stopped';
auctionsCtrl = require('./auctions');

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
    api_client.getAuctions()
        .then(function (data) {
            console.log(data);
            data = JSON.parse(data);
            if(parseInt(data.files[0].lastModified)>parseInt(nconf.get('lastupdate:auctiondb'))){
                nconf.set('lastupdate:auctiondb', data.files[0].lastModified);
                peticiones.peticion(data.files[0].url)
                    .then(function (data){
                        //console.log(typeof(data));
                        data = JSON.parse(data);
                        auctionsCtrl.add(data.auctions[0]);
                    });
            }
        })
        .catch(function(err){
            console.log(err);
        });
};

