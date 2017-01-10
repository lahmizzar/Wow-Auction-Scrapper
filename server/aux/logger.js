/**
 * Created by chuclucillo on 10/01/17.
 */
var fs = require('fs');
var util = require('util');
var path = require('path');

var fecha = new Date().toISOString().slice(0,10).replace(new RegExp('-', 'g'),'');
var log_file = fs.createWriteStream(__dirname + '/../../log/debug-' + fecha + '.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) {
    var now = new Date();
    log_file.write(now.toLocaleString('es') + '--' + util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};