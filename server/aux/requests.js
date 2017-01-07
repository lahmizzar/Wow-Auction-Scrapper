/**
 * Created by chuclucillo on 1/07/16.
 */
var https, nconf;
https = require("https");
nconf = require("nconf");

nconf.file({ file: './conf.json' });

//Función Auxiliar
exports.request =  function(url) {
    return new Promise(function (resolve, reject) {
        const lib = url.startsWith('https') ? require('https') : require('http');
        lib.get(url, function (response) {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            const body = [];
            response.on('data', function (chunk) {
                body.push(chunk)
            });
            response.on('end', function () {
                resolve(body.join(''));
            });
        });
    });
};
exports.requestSSL = function(ruta){
    return new Promise(function(resolve, reject) {
        var options = {
            hostname: nconf.get('battlenet-api:host'),
            port: nconf.get('battlenet-api:port'),
            path: nconf.get('battlenet-api:baseurl') + ruta + '/' + decodeURIComponent(nconf.get('battlenet-api:realm')) + '?locale=' + nconf.get('battlenet-api:locale') + '&apikey=' + nconf.get('battlenet-api:key'),
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                accept: '*/*'
            }
        };
        var request = https.request(options, function(res) {
            if (res.statusCode < 200 || res.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + res.statusCode));
            }
            var str = '';
            res.on('data', function (chunk) {
                str += chunk;
            });
            res.on('end', function(){
                resolve(str);
            });
        });
        request.end();
    });
};