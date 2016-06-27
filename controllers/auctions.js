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