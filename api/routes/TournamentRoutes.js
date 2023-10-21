module.exports = function(app) {
    const TournamentController = require("../controllers/TournamentController");
    
    app.get("/tournaments", TournamentController.getTournaments);
    app.get("/tournament/:tournamentId", TournamentController.getSingleTournament);
    app.post("/tournament", TournamentController.createTournament);
    app.post("/league/:tournamentId", TournamentController.getLeague);
};