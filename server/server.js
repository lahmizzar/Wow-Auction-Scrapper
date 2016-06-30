/**
 * Created by chuclucillo on 27/06/16.
 */
'use strict';
var express, nconf, bodyParser, methodOverride, mongoose, app;
express = require("express");
nconf = require("nconf");
bodyParser = require("body-parser");
methodOverride = require("method-override");
mongoose = require("mongoose");
app = express();

nconf.file({ file: './conf.json' });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.get('/', function(req, res) {
    res.send("Front-page");
});


//Acceso a datos
app.use(router);
var AuctionCtrl,auctions;
AuctionCtrl = require('./controllers/auctions');
auctions = express.Router();

auctions.route('/auctions')
    .get(AuctionCtrl.findAllAuctions)
    .put(AuctionCtrl.addAuction);

auctions.route('/auctions/:id')
    .get(AuctionCtrl.findById)
    .put(AuctionCtrl.updateAuction)
    .delete(AuctionCtrl.deleteAuction);

app.use('/api', auctions);
mongoose.connect('mongodb://' + nconf.get('database:host') + ':' + nconf.get('database:port') + '/' + nconf.get('database:db'), function (err) {
    if(err) {
        console.log('ERROR: connecting to Database. ' + err);
    }
    app.listen(nconf.get('server:port'), function() {
        console.log("Auction Scrapper: escuchando en el puerto " + nconf.get('server:port'));
    });
});



//Procesos de limpieza para el cierre
function exitHandler(options, err) {

    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}
process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));