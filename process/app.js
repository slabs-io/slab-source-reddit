'use strict';

var Reddit = require('./reddit');

var USER_AGENT = 'slabs.io.example.myredditapp:v1.0.0 (by /u/rust-dev)';
var CLIENT_ID = 'T3Y9ALPBq-oryQ';
var CLIENT_SECRET = process.env.REDDIT_SECRET;

exports.getData = function (settings) {

    var reddit = new Reddit({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        userAgent: USER_AGENT
    });
    
    return reddit.search(settings);
};

exports.getLabel = function (property, settings) {

    // this is the object saved from your the /input portion of the slab.
    var searchTerm = 'example';

    if (settings && settings.query) {
        searchTerm = settings.query;
    }

    if (property === 'mentions') {
        return 'Posts mentioning ' + searchTerm + ' on Reddit';
    }

    return property + ' : bad property name';

};
