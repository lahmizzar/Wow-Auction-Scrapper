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
    //task_auctions();
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
    async.waterfall([
        function(callback_1) {
            console.log('- Asking API for auctions file...');
            api_client.getAuctions()
                .then(function (data) {
                    data = JSON.parse(data);
                    if(parseInt(data.files[0].lastModified) <= parseInt(nconf.get('lastupdate:auctiondb'))) return callback_1(new Error('Actions package already processed'));

                    nconf.set('lastupdate:auctiondb', data.files[0].lastModified);
                    callback_1(null, data);
                });
        },
        function(data, callback_1) {
            var last_mod = data.files[0].lastModified;
            console.log('- Downloading Auctions file...' + last_mod);
            requests.request(data.files[0].url)
                .then(function(data){
                    console.log('- Processing Auctions file...');
                    data = JSON.parse(data);
                    callback_1(null, data);
                });
        },
        function(data, callback_1){
            var auctions = data.auctions,
                contador = 0,
                updated = 0,
                inserted = 0;
            console.log('-- Auctions a procesar:' + auctions.length);
            async.each(auctions, function(auction, callback_2){
                contador++;
                //console.log('--- processing auction: ' + contador);
                auctionsCtrl.findById(auction.auc)
                    .then(function (response) {
                        if (response.success && response.data != null) {
                            auctionsCtrl.update(auction.auc, auction).then(function (response) {
                                if (!response.success)
                                    console.log('Error update: ' + auction.auc + ' - ' + response.message);
                                updated++;
                                callback_2(null);
                            });
                        } else {
                            auctionsCtrl.add(auction).then(function (response) {
                                if (!response.success)
                                    console.log('Error add: ' + auction.auc + ' - ' + response.message);
                                //console.log('--- insert:' + auction.auc);
                                inserted++;
                                callback_2(null);
                            });
                        }
                    });
            }, function (err){
                if( err ) {
                    console.log('-- Ocurrió un error procesando auctions');
                } else {
                    console.log('-- auctions procesados (' + inserted + ' insertados, ' + updated + ' actualizados)');
                }
                callback_1(null);
            });
        },
        function(callback_1) {
            var auctionsToEnd = null;
            console.log('- Ending Auctions ended...');
            auctionsCtrl.findEndedNotMarked(timer)
                .then(function(response){
                    console.log(response.data);
                    if(response.success && response.data != null){
                        auctionsToEnd = response.data;
                        async.each(auctionsToEnd, function(auction, callback_2){
                            auctionsCtrl.end(auction._id)
                                .then(function (response) {
                                    if(!response.success){
                                        console.log('Error ending auction: ' + auction._id + ' - ' + response.message);
                                    }
                                    callback_2(null);
                                });
                        }, function(err){
                            if(err) console.log(err.message);
                            callback_1(null);
                        });
                    }else{
                        callback_1(null);
                    }
                });
        }
    ],function(err) {
        if(err) console.log(err.message);
        console.log('-== End Get API Auctions==-');
        console.log('Operation elapsed', ((new Date().getTime() - timer.getTime())/1000), 'seconds.');
    });
};