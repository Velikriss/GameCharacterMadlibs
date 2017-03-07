var Controller = require('../controller/controller.js');
var helpers = require('./helpers.js'); // our custom middleware
var Request = require('request');
var cheerio = require('cheerio');

module.exports = (app, express) => {
  app.post('/scrape', (request, response) => {
    var title = request.body.data;    
    var url = 'http://www.gamerevolution.com/game/all/' + title.charAt(0) + '/long_name/asc';
    console.log(url);
    Request(url, (error, response, html) => {
      if (!error) {
        var $ = cheerio.load(html);
        var json = {title: ""};

        $('tr.trIndexList td.tdIndexList a.headline').filter(function() {
          console.log(this.children[0].data);        
        });
      }
    });

    response.send(request.body.data)

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

