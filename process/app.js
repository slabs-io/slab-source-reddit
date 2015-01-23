'use strict';

var Q       = require('q'),
    getFacebookData = require('./getFacebookData');

exports.getData = function(settings) {
    var deferred = Q.defer();

    var id = encodeURIComponent(settings.id);
    console.log(id);
    getFacebookData('?id='+id).then(function(result) {
        console.log(result);
        var shares = result.share && result.share.share_count;
        deferred.resolve({
            shares : shares
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

    if(property === 'shares'){
        return 'Shares of ' + searchTerm + ' on Facebook';
    }

    return property + ' : bad property name';

};