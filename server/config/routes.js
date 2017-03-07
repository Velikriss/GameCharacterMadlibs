var Controller = require('../controller/controller.js');
var helpers = require('./helpers.js'); // our custom middleware
var Request = require('request');
var cheerio = require('cheerio');
var Fuse = require('fuse.js');
var http = require('http');
var qs = require('qs');
var api = require('./apikeys.js')

module.exports = (app, express) => {
  app.post('/scrape', (request, response) => {
    var title = request.body.data;    
    var url = 'http://www.gamerevolution.com/game/all/' + title.charAt(0) + '/long_name/asc';
    console.log(url);
    Request(url, (error, res, html) => {
      if (!error) {
        var $ = cheerio.load(html);
        var titles = [];

        $('tr.trIndexList td.tdIndexList a.headline').filter(function() {
          titles.push({ title: this.children[0].data });        
        });

      var options = {
        include: ["score"],
        shouldSort: true,
        findAllMatches: true,
        threshold: 0.3,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [ "title" ]
      };
      
      var fuse = new Fuse(titles, options); // "list" is the item array
      var result = fuse.search(title);
      }
      result.forEach(title => {
        console.log(title.item.title, 'Score:', title.score);
      });
//http://www.giantbomb.com/api/game/3030-4725/?api_key=3acbcef53f761af3af8482e435cd1ad0853762fa&format=json
      var base_url = 'http://www.giantbomb.com/';
      var path = 'api/search';
      var params = {
        api_key: api.GIANTBOMBAPIKEY,
        limit: 3,
        query: result[0].item.title,
        resources: 'game',
        format: 'json'
      };

      var gameUrl = base_url;
      gameUrl += path;
      //gameUrl += qs.stringify(params);

      var options = {
        url: gameUrl,
        headers: {
          'User-Agent': 'express'
        },
        qs: params
      };
      
      Request.get(options, (err, result, body) => {
        var data = JSON.parse(body);
        options.url = data.results[0].api_detail_url;
        options.params = {
          api_key: api.GIANTBOMBAPIKEY,
          limit: 3,
          format: 'json'
        };

        Request.get(options, (err, result, body) => {
          var data = JSON.parse(body);
          response.send(data.results);
        });
      
      });
    });
  });

  app.post('/tiers', (request, response) => {
    //console.log(request.body.data);
    var title = request.body.data.title;
    var characters = request.body.data.characters;
    var searchParams = {
      q: `${title} character tier list ${characters[0].name}`,
      safe: 'on'
    };

    console.log(searchParams.q);
    var options = {
      url: 'https://www.google.com',
      qs: searchParams
    };

    Request.get(options, (err, result, body)=> {
      var $ = cheerio.load(body);
        var titles = [];

        $('tr.trIndexList td.tdIndexList a.headline').filter(function() {
          titles.push({ title: this.children[0].data });        
        });
      console.log(err, result, body);
      response.send(body);

    });
    //console.log(request.characters);

    //response.send(JSON.stringify({results: 'You are on your way'}));

  });


  /*app.get('/:code', linksController.navToLink);

  app.post('/api/users/signin', userController.signin);
  app.post('/api/users/signup', userController.signup);
  app.get('/api/users/signedin', userController.checkAuth);

  // authentication middleware used to decode token and made available on the request
  // app.use('/api/links', helpers.decode);
  app.get('/api/links/', linksController.allLinks);
  app.post('/api/links/', linksController.newLink);

  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);*/
};

function buildUrl(path, params) {
  if( typeof params !== 'object' )
    params = {}
  params.api_key = this.apiKey
  params.limit = params.limit || this.baseLimit
  params.format  = 'json'
  if( params.page ){ // 1, 2, .. infinity
    params.offset = (params.page - 1)*this.baseLimit
    delete params.page
  } else {
    params.offset = params.offset || 0
  }

  var url = base_url
  url += path+"?"
  url += qs.stringify(params)
  return url
}

