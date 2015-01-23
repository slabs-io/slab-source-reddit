var Q       = require('q'),
    https    = require('https');

var appId = process.env.FACEBOOK_APP_ID;
var clientSecret = process.env.FACEBOOK_CLIENT_SECRET;

var getToken = function(){

    var deferred = Q.defer();

    var request = https.request({
        host:'graph.facebook.com',
        port:443,
        path: '/oauth/access_token?client_id=' + appId + '&client_secret=' + clientSecret
        + '&grant_type=client_credentials',
        method: 'GET',
        headers: {
            'User-Agent': 'slabs.io app'
        }
    }, responseHandler(deferred, function(result){
        return result.split('=')[1];
    }));

    request.end();

    return deferred.promise;

};

var queryFacebook = function(query, access_token){
    var deferred = Q.defer();

    var amp = query.indexOf('?') > -1 ? '&' : '?';

    var request = https.request({
        host:'graph.facebook.com',
        port:443,
        path: '/v2.2/' + query + amp + 'access_token=' + access_token,
        method: 'GET',
        headers: {
            'User-Agent': 'slabs.io app'
        }
    }, responseHandler(deferred, function(result){
        return JSON.parse(result);
    }));

    request.end();


    return deferred.promise;
};

var responseHandler = function(deferred, processResult){

    return function(res){
        var output = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('error', function(e) {
            console.log('problem with request: ' + e.message);
            deferred.error(e.message);
        });

        res.on('end', function() {
            var data = processResult(output);
            deferred.resolve(data);
        });
    };
};

module.exports = function(query){
    var deferred = Q.defer();

    getToken().then(function(access_token){
        queryFacebook(query, access_token).then(function(result) {
            if(result.error){
                deferred.error(result);
            }else {
                deferred.resolve(result);
            }
        });
    });

    return deferred.promise;
};