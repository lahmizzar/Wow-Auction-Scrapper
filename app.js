/**
 * Created by chuclucillo on 27/06/16.
 */
var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.get('/', function(req, res) {
    res.send("Hello World!");
});

app.use(router);
var AuctionCtrl = require('./controllers/auctions');
var auctions = express.Router();

auctions.route('/api/auctions')
    .get(AuctionCtrl.findAllAuctions)
    .post(AuctionCtrl.addAuction);

auctions.route('/api/auctions/:id')
    .get(AuctionCtrl.findById)
    .put(AuctionCtrl.updateAuction)
    .delete(AuctionCtrl.deleteAuction);

app.use('/api', auctions);

mongoose.connect('mongodb://localhost/auctionscrapper', function (err) {
    if(err) {
        console.log('ERROR: connecting to Database. ' + err);
    }
    app.listen(3000, function() {
        console.log("Node server running on http://localhost:3000");
    });
});
