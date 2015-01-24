'use strict';

var Q       = require('q');

exports.getData = function(settings) {
    var deferred = Q.defer();
    

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