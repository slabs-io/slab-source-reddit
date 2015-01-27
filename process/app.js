'use strict';

var Q       = require('q');

var userAgent = 'slabs.io.example.myredditapp:v1.0.0 (by /u/rust-dev)';

var clientId = 'T3Y9ALPBq-oryQ';
var client_secret = process.env.reddit_secret;

exports.getData = function(settings) {
    var deferred = Q.defer();
    
    var access_token = 'https://www.reddit.com/api/v1/access_token'

    return deferred.promise;
};

exports.getLabel = function(property, settings){

    // this is the object saved from your the /input portion of the slab.
    var searchTerm  = 'example';

    if(settings && settings.query){
        searchTerm  = settings.query
    }

    if(property === 'mentions'){
        return 'Posts mentioning ' + searchTerm + ' on Reddit';
    }

    return property + ' : bad property name';

};