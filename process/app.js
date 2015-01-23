'use strict';

var Q       = require('q'),
    getFacebookData = require('./getFacebookData');

exports.getData = function(settings) {
    var deferred = Q.defer();

    getFacebookData(settings.pageId).then(function(result) {
        deferred.resolve({
            likes : result.likes
        });
    });

    return deferred.promise;
};

exports.getLabel = function(property, settings){

    // this is the object saved from your the /input portion of the slab.
    var searchTerm  = 'example';

    if(settings && settings.pageId){
        searchTerm  = settings.pageId;
    }

    if(property === 'likes'){
        return 'Likes on ' + searchTerm + ' Facebook page';
    }

    return property + ' : bad property name';

};