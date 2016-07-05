/**
 * Created by chuclucillo on 30/06/16.
 */
'use strict';
var cron, async, api_client, cron_auctions, status, nconf, requests, auctionsCtrl;
cron = require('node-cron');
async = require("async");
nconf = require("nconf");
api_client = require('./api_client');
requests = require('../aux/requests');
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
/*var task_auctions = function() {
    console.log('Escaneando auctions');
    api_client.getAuctions()
        .then(function (data) {
            data = JSON.parse(data);
            if(parseInt(data.files[0].lastModified) <= parseInt(nconf.get('lastupdate:auctiondb'))) return null;
            nconf.set('lastupdate:auctiondb', data.files[0].lastModified);
            requests.request(data.files[0].url)
                .then(function (data){
                    data = JSON.parse(data);
                    data.auctions.forEach(function(item) {
                        auctionsCtrl.findById(item.auc)
                            .then(function (response) {
                                if (response.success && response.data != null) {
                                    auctionsCtrl.update(item.auc, item).then(function (response) {
                                        if (!response.success)
                                            console.log('Error guardando datos: ' + response.message);
                                    });
                                } else {
                                    auctionsCtrl.add(item).then(function (response) {
                                        if (!response.success)
                                            console.log('Error guardando datos: ' + response.message);
                                    });
                                }
                            });
                    });
                });
        });
};*/
var task_auctions = function() {
    console.log('-== Begin Get API Auctions ==-');
    var timer= new Date();
    var local_vars = {};
    async.series([
        function(callback_1) {
            console.log('Asking API for auctions file...')
            api_client.getAuctions()
                .then(function (data) {
                    data = JSON.parse(data);
                    if(parseInt(data.files[0].lastModified) <= parseInt(nconf.get('lastupdate:auctiondb'))) return callback_1(new Error('Actions package already processed'));
                    local_vars.api_data = data;
                    nconf.set('lastupdate:auctiondb', data.files[0].lastModified);
                    callback_1();
                });
        },
        function(callback_1) {
            console.log('Downloading Auctions file...')
            requests.request(local_vars.api_data.files[0].url)
                .then(function(data){
                    console.log('Processing Auctions file...')
                    data = JSON.parse(data);
                    local_vars.auctions = data;

                });
        }
    ],function(){
        console.log('-== End Get API Auctions==-');
    });
};

