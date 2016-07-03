/**
 * Created by chuclucillo on 27/06/16.
 */
'use strict';
var mongoose, Schema;
mongoose = require('mongoose');
Schema = mongoose.Schema;

var auctionSchema = new Schema({
    _id:                { type: number},
    fecha:              { type: Date, default: Date.now, required: true },
    fecha_actualizado:  { type: Date, default: Date.now, required: true },
    finalizada:         { type: Boolean, default: false },
    item:               { type: Number, required: true },
    owner:              { type: String },
    realm:              { type: String },
    bid:                { type: Number },
    buyout:             { type: Number },
    quantity:           { type: Number },
    timeLeft:           { type: String },
    rand:               { type: Number },
    seed:               { type: Number },
    context:            { type: Number },
    modifiers:          [{
        'type':         { type: Number },
        value:          { type: Number }
    }],
    bonusLists:         [{
        bonusListId:    { type: Number }
    }],
    petSpeciesId:       { type: Number },
    petBreedId:         { type: Number },
    petLevel:           { type: Number },
    petQualityId:       { type: Number },
    raw:                { type: String }
}, { _id: false });

module.exports = mongoose.model('Auction', auctionSchema);