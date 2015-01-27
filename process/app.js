'use strict';

var Q       = require('q');
var request = require('request');

var userAgent = 'slabs.io.example.myredditapp:v1.0.0 (by /u/rust-dev)';

var clientId = 'T3Y9ALPBq-oryQ';
var client_secret = process.env.REDDIT_SECRET;

exports.getData = function(settings) {
    var deferred = Q.defer();
    
    var accessTokenURI = 'https://www.reddit.com/api/v1/access_token';
    request.post(accessTokenURI, {
      'auth': {
        'user': clientId,
        'pass': client_secret
      },
      headers: {
            'User-Agent': userAgent,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
      body:'grant_type=client_credentials'
    },function (error, response, body) {
       // Do more stuff with 'body' here
       if(error){
           console.log(error);
           console.log(response);
           return;
       }
       
       var access = JSON.parse(body).access_token;
       request.get('https://oauth.reddit.com/api/v1/search?q=' + settings.query +
        '&show=all&sort=new&t=day', {
           headers:{
               'User-Agent': userAgent,
               'Authorization': 'bearer ' + access
           }
       }, function(err, response, body){
           if(err){
               console.log('error:');
               console.log(err);
               console.log(response);
               return;
           }
            console.log(response.headers);
            console.log(body);
            
            request.post('https://www.reddit.com/api/v1/revoke_token', {
                body: 'token='+access+'&token_type_hint=access_token',
                headers:{
                    'User-Agent': userAgent,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }, function(err, response, body){
                if(err){return}
                console.log(body);
            })
       });
       
//      https://www.reddit.com/api/v1/revoke_token
//      Include the following information in your POST data (not in the URL):

//      token=TOKEN&token_type_hint=TOKEN_TYPE
    });

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