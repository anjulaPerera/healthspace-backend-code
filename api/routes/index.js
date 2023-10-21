var express = require('express');
var router = express.Router();

router.get('/', function(req, res){    
    res.send("Welcome to API!");
});

require('./TournamentRoutes')(router);
require('./TeamRoutes')(router);
require('./MatchRoutes')(router);

module.exports.router = router;