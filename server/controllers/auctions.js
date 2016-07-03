/**
 * Created by chuclucillo on 27/06/16.
 */
'use strict';
var mongoose, AuctionMdl, Auction;
mongoose = require('mongoose');
AuctionMdl = require('../models/auctions');
Auction = mongoose.model('Auction');

exports.findById = function(id){
    Auction.findById(id, function(err, auction) {
        if(err) return {"success": false, "message":err.message};
        return {"success":true, "message":"", "data": auction};
    });
};
exports.findAll = function(){
    Auction.find(function(err, auctions) {
        if(err) return {"success": false, "message":err.message};
        return {"success":true, "message":"", "data": auctions};
    });
};
exports.add = function(data){
    var modifiers = [];
    var bonusLists = [];
    if(typeof(data.modifiers)!='undefined') {
        data.modifiers.forEach(function(modifier){
            modifiers.put({'type': modifier.type, 'value': modifier.value});
        });
    }
    if(typeof(data.bonusLists)!='undefined') {
        data.bonusLists.forEach(function(bonusList){
            bonusLists.put({'bonusListId': bonusList.bonusListId});
        });
    }

    var auction = new Auction({
        _id:                data.auc,
        fecha:              data.fecha,
        fecha_actualizado:  data.fecha_actualizado,
        finalizada:         data.finalizada,
        item:               data.item,
        owner:              data.owner,
        realm:              data.realm,
        bid:                data.bid,
        buyout:             data.buyout,
        quantity:           data.quantity,
        timeLeft:           data.timeLeft,
        rand:               data.rand,
        seed:               data.seed,
        context:            data.context,
        modifiers:          modifiers,
        bonusLists:         bonusLists,
        petSpeciesId:       data.petSpeciesId,
        petBreedId:         data.petBreedId,
        petLevel:           data.petLevel,
        petQualityId:       data.petQualityId,
        raw:                JSON.stringify(data)
    });

    auction.save(function(err, auction) {
        if(err)
            return {"success":false, "message": err.message};
        return {"success": true, "message": "", "data": auction};
    });
};
exports.update = function(id, data){
    Auction.findById(id, function(err, auction) {
        var modifiers = [];
        var bonusLists = [];
        if(typeof(data.modifiers)!='undefined') {
            data.modifiers.forEach(function(modifier){
                modifiers.put({'type': modifier.type, 'value': modifier.value});
            });
        }
        if(typeof(data.bonusLists)!='undefined') {
            data.bonusLists.forEach(function(bonusList){
                bonusLists.put({'bonusListId': bonusList.bonusListId});
            });
        }
        auction.fecha               = data.fecha;
        auction.fecha_actualizado   = data.fecha_actualizado;
        auction.finalizada          = data.finalizada;
        auction.item                = data.item;
        auction.owner               = data.owner;
        auction.realm               = data.realm;
        auction.bid                 = data.bid;
        auction.buyout              = data.buyout;
        auction.quantity            = data.quantity;
        auction.timeLeft            = data.timeLeft;
        auction.rand                = data.rand;
        auction.seed                = data.seed;
        auction.context             = data.context;
        auction.modifiers           = modifiers;
        auction.bonusLists          = bonusLists;
        auction.petSpeciesId        = data.petSpeciesId;
        auction.petBreedId          = data.petBreedId;
        auction.petLevel            = data.petLevel;
        auction.petQualityId        = data.petQualityId;
        auction.raw                 = JSON.stringify(req.body);

        auction.save(function(err) {
            if(err)
                return {"success":false, "message":err.message};
            return {"success": true, "message":"", "data":auction};
        });
    });
};
exports.remove = function(id){
    Auction.findById(id, function(err, auction) {
        auction.remove(function(err) {
            if(err)
                return {"sucess": false, "message": err.message};
            return {"sucess": true, "message": ""};
        });
    });
};

exports.findAllAPI = function(req, res) {
    var response = exports.findAll();
    if(!response.success)
        res.status(500).send(response.message);

    console.log('GET /auctions');
    res.status(200).jsonp(response.data);
};
exports.findByIdAPI = function(req, res) {
    var response = exports.findById(req.params.id);
    if(!response.success)
        res.status(500).send(response.message);

    console.log('GET /auction/' + req.params.id);
    res.status(200).jsonp(response.data);
};
exports.addAPI = function(req, res) {
    var response = exports.add(req.body);
    if(!response.success)
        return res.status(500).send(response.message);
    console.log('PUT /auction/');
    return res.status(200).jsonp(response.data);
};
exports.updateAPI = function(req, res) {
    var response = exports.update(req.params.id, req.body);

    if(!response.success)
        return res.status(500).send(response.message);

    console.log('PUT /auctions/' + req.params.id);
    return res.status(200).jsonp(response.data);
};
exports.deleteAPI = function(req, res) {
    var response = exports.remove(req.params.id);
    if(!response.success)
        return res.status(500).send(response.message);

    console.log('DELETE /auctions/' + req.params.id);
    res.status(200).send();
};