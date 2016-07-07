/**
 * Created by chuclucillo on 27/06/16.
 */
'use strict';
var mongoose, AuctionMdl, Auction, findById, findByIdAPI, findAll, findAllAPI, add, addAPI, update, updateAPI, remove, removeAPI;
mongoose = require('mongoose');
AuctionMdl = require('../models/auctions');
Auction = mongoose.model('Auction');

findById = function(id){
    return new Promise(function (resolve) {
        Auction.findById(id, function(err, auction) {
            if( err != null){
                resolve({"success": false, "message": err.message});
            }else {
                resolve({"success": true, "message": "", "data": auction});
            }
        });
    });
};
findAll = function(){
    return new Promise(function (resolve) {
        Auction.find({}, function (err, auctions) {
            if (err != null) {
                resolve({"success": false, "message": err.message});
            } else {
                resolve({"success": true, "message": "", "data": auctions});
            }
        });
    });
};
add = function(data){
    return new Promise(function (resolve) {
        var modifiers = [];
        var bonusLists = [];
        if (typeof(data.modifiers) != 'undefined') {
            data.modifiers.forEach(function (modifier) {
                modifiers.push({'type': modifier.type, 'value': modifier.value});
            });
        }
        if (typeof(data.bonusLists) != 'undefined') {
            data.bonusLists.forEach(function (bonusList) {
                bonusLists.push({'bonusListId': bonusList.bonusListId});
            });
        }
        var auction = new Auction({
            _id: data.auc,
            fecha: Date.now(),
            fecha_actualizado: Date.now(),
            finalizada: false,
            item: data.item,
            owner: data.owner,
            realm: data.ownerRealm,
            bid: data.bid,
            buyout: data.buyout,
            quantity: data.quantity,
            timeLeft: data.timeLeft,
            rand: data.rand,
            seed: data.seed,
            context: data.context,
            modifiers: modifiers,
            bonusLists: bonusLists,
            petSpeciesId: data.petSpeciesId,
            petBreedId: data.petBreedId,
            petLevel: data.petLevel,
            petQualityId: data.petQualityId,
            raw: JSON.stringify(data)
        });
        auction.save(function (err, auction) {
            if (err != null) {
                console.log(err);
                resolve({"success": false, "message": err});
            } else {
                resolve({"success": true, "message": "", "data": auction});
            }
        });
    });
};
update = function(id, data){
    return new Promise(function (resolve) {
        Auction.findById(id, function (err, auction) {
            if(auction == null){ resolve({"success": false, "message": "no exists"}); return null }
            /*var modifiers = [];
            var bonusLists = [];
            if (typeof(data.modifiers) != 'undefined') {
                data.modifiers.forEach(function (modifier) {
                    modifiers.put({'type': modifier.type, 'value': modifier.value});
                });
            }
            if (typeof(data.bonusLists) != 'undefined') {
                data.bonusLists.forEach(function (bonusList) {
                    bonusLists.put({'bonusListId': bonusList.bonusListId});
                });
            }*/
            //auction.fecha = data.fecha;
            auction.fecha_actualizado = Date.now();
            auction.finalizada = false;
            //auction.item = data.item;
            //auction.owner = data.owner;
            //auction.realm = data.ownerRealm;
            auction.bid = data.bid;
            //auction.buyout = data.buyout;
            //auction.quantity = data.quantity;
            auction.timeLeft = data.timeLeft;
            //auction.rand = data.rand;
            auction.seed = data.seed;
            auction.context = data.context;
            //auction.modifiers = modifiers;
            //auction.bonusLists = bonusLists;
            //auction.petSpeciesId = data.petSpeciesId;
            //auction.petBreedId = data.petBreedId;
            //auction.petLevel = data.petLevel;
            //auction.petQualityId = data.petQualityId;
            auction.raw = JSON.stringify(data);

            auction.save(function (err) {
                if (err != null) {
                    console.log(err);
                    resolve({"success": false, "message": err.message, "data": data});
                } else {
                    resolve({"success": true, "message": "", "data": auction});
                }
            });
        });
    });
};
remove = function(id){
    return new Promise(function (resolve) {
        Auction.findById(id, function (err, auction) {
            auction.remove(function (err) {
                if (err != null) {
                    resolve({"sucess": false, "message": err.message});
                } else {
                    resolve({"sucess": true, "message": ""});
                }
            });
        });
    });
};

findAllAPI = function(req, res) {
    findAll()
        .then(function(response) {
            if (!response.success)
                res.status(500).send(response.message);

            console.log('GET /auctions');
            res.status(200).jsonp(response.data);
        });
};
findByIdAPI = function(req, res) {
    findById(req.params.id)
        .then(function(response) {
            if (!response.success)
                res.status(500).send(response.message);

            console.log('GET /auction/' + req.params.id);
            res.status(200).jsonp(response.data);
        });
};
addAPI = function(req, res) {
    add(req.body)
        .then(function(response) {
            if (!response.success)
                return res.status(500).send(response.message);
            console.log('PUT /auction/');
            return res.status(200).jsonp(response.data);
        });
};
updateAPI = function(req, res) {
    update(req.params.id, req.body)
        .then(function(response) {

            if (!response.success)
                return res.status(500).send(response.message);

            console.log('PUT /auctions/' + req.params.id);
            return res.status(200).jsonp(response.data);
        });
};
removeAPI = function(req, res) {
    remove(req.params.id)
        .then(function(response) {
            if (!response.success)
                return res.status(500).send(response.message);

            console.log('DELETE /auctions/' + req.params.id);
            res.status(200).send();
        });
};

module.exports = {
    findAll: findAll,
    findAllAPI: findAllAPI,
    findById: findById,
    findByIdAPI: findByIdAPI,
    add: add,
    addAPI: addAPI,
    update: update,
    updateAPI: updateAPI,
    remove: remove,
    removeAPI: removeAPI
};