'use strict';

var Q = require('q');
var request = require('request');



var Reddit = function (params){
    this.clientId = params.clientId;
    this.clientSecret = params.clientSecret;
    this.userAgent = params.userAgent;
};

Reddit.prototype.search = function(settings){
    this.deferred = Q.defer();
    this.mentions = 0;
    this.query = settings.query;
    
    var beginSearch = function(accessToken){
        this.accessToken = accessToken;
        this._continueSearch();
    };
    
    this._getAccessToken().then(beginSearch.bind(this));
    
    return this.deferred.promise;
};

Reddit.prototype._continueSearch = function(nextPage){
    this._getMentions(nextPage)
        .then(this._getResult.bind(this))
        .catch(function(error){
            console.error(error);
        });
};

Reddit.prototype._getResult = function(data){
    this.mentions += data.children.length;
        
    if (data.after === null){
        this.deferred.resolve({
            mentions: this.mentions
        });
        this._revokeToken();
    }else{
        this._continueSearch(data.after);
    }
};


Reddit.prototype._getAccessToken = function () {

    return this._req('post', 'https://www.reddit.com/api/v1/access_token', 
        {
            'auth': {
                'user': this.clientId,
                'pass': this.clientSecret
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        }, 
        function (body) {
            return JSON.parse(body).access_token;
        }
    );
};

Reddit.prototype._getMentions = function(after) {

    var afterString = after ? '&after=' + after : '';
    
    return this._req('get', 'https://oauth.reddit.com/search?q=' + this.query +
        '&sort=new&t=hour&limit=100' + afterString, {
            headers: {
                'Authorization': 'bearer ' + this.accessToken
            }
        }, function(body){
            return JSON.parse(body).data;
        });
};

Reddit.prototype._req = function(type, uri, config, map) {
    var deferred = Q.defer();
    var responseHandler = handleResponse(deferred, map);
    
    config.headers = config.headers || {};
    config.headers['User-Agent'] = this.userAgent;

    request[type](uri, config, responseHandler);

    return deferred.promise;
};


Reddit.prototype._revokeToken = function() {
    request.post('https://www.reddit.com/api/v1/revoke_token', {
        'auth': {
            'user': this.clientId,
            'pass': this.clientSecret
        },
        body: 'token=' + this.accessToken + '&token_type_hint=access_token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};

function handleResponse(promise, map) {
    return function (err, response, body) {
        if (err) {
            return promise.fail(err);
        }

        var output = body;
        if (map) {
            output = map(body);
        }
        promise.resolve(output);
    };
}



module.exports = Reddit;