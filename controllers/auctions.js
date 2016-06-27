/**
 * Created by chuclucillo on 27/06/16.
 */
var mongoose = require('mongoose');
var Auction  = mongoose.model('Auction');


exports.findAllAuctions = function(req, res) {
    Auction.find(function(err, auctions) {
        if(err) res.send(500, err.message);

        console.log('GET /auctions');
        res.status(200).jsonp(auctions);
    });
};
exports.findById = function(req, res) {
    Auction.findById(req.params.id, function(err, auction) {
        if(err) return res.send(500, err.message);

        console.log('GET /auction/' + req.params.id);
        res.status(200).jsonp(auction);
    });
};
exports.addAuction = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var modifiers = [];
    var bonusLists = [];
    if(typeof(req.body.modifiers)!='undefined') {
        req.body.modifiers.forEach(function(modifier){
            modifiers.put({'type': modifier.type, 'value': modifier.value});
        });
    }
    if(typeof(req.body.bonusLists)!='undefined') {
        req.body.bonusLists.forEach(function(bonusList){
            bonusLists.put({'bonusListId': bonusList.bonusListId});
        });
    }

    var auction = new Auction({
        fecha:              req.body.fecha,
        fecha_actualizado:  req.body.fecha_actualizado,
        finalizada:         req.body.finalizada,
        item:               req.body.item,
        owner:              req.body.owner,
        realm:              req.body.realm,
        bid:                req.body.bid,
        buyout:             req.body.buyout,
        quantity:           req.body.quantity,
        timeLeft:           req.body.timeLeft,
        rand:               req.body.rand,
        seed:               req.body.seed,
        context:            req.body.context,
        modifiers:          modifiers,
        bonusLists:         bonusLists,
        petSpeciesId:       req.body.petSpeciesId,
        petBreedId:         req.body.petBreedId,
        petLevel:           req.body.petLevel,
        petQualityId:       req.body.petQualityId,
        raw:                JSON.stringify(req.body)
    });

    auction.save(function(err, auction) {
        if(err) return res.status(500).send( err.message);
        res.status(200).jsonp(auction);
    });
};
exports.updateAuction = function(req, res) {
    Auction.findById(req.params.id, function(err, auction) {
        var modifiers = [];
        var bonusLists = [];
        if(typeof(req.body.modifiers)!='undefined') {
            req.body.modifiers.forEach(function(modifier){
                modifiers.put({'type': modifier.type, 'value': modifier.value});
            });
        }
        if(typeof(req.body.bonusLists)!='undefined') {
            req.body.bonusLists.forEach(function(bonusList){
                bonusLists.put({'bonusListId': bonusList.bonusListId});
            });
        }
        auction.fecha               = req.body.fecha;
        auction.fecha_actualizado   = req.body.fecha_actualizado;
        auction.finalizada          = req.body.finalizada;
        auction.item                = req.body.item;
        auction.owner               = req.body.owner;
        auction.realm               = req.body.realm;
        auction.bid                 = req.body.bid;
        auction.buyout              = req.body.buyout;
        auction.quantity            = req.body.quantity;
        auction.timeLeft            = req.body.timeLeft;
        auction.rand                = req.body.rand;
        auction.seed                = req.body.seed;
        auction.context             = req.body.context;
        auction.modifiers           = modifiers;
        auction.bonusLists          = bonusLists;
        auction.petSpeciesId        = req.body.petSpeciesId;
        auction.petBreedId          = req.body.petBreedId;
        auction.petLevel            = req.body.petLevel;
        auction.petQualityId        = req.body.petQualityId;
        auction.raw                 = JSON.stringify(req.body);

        auction.save(function(err) {
            if(err) return res.status(500).send(err.message);
            res.status(200).jsonp(auction);
        });
    });
};
exports.deleteAuction = function(req, res) {
    Auction.findById(req.params.id, function(err, auction) {
        auction.remove(function(err) {
            if(err) return res.status(500).send(err.message);
            res.status(200).send();
        })
    });
};