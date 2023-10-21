module.exports = function(app) {
    const MatchController = require("../controllers/MatchController")
    
    app.post("/match/create", MatchController.createMatch);
    app.get("/matches-by-tournament/:tournamentId", MatchController.getAllMatchesByTournamentId);
    app.get("/match-details/:matchId", MatchController.getMatchDetails);

    app.post("/update-macth-status", MatchController.updateMatchStatus);
    app.post("/update-current-players", MatchController.updateCurrentPlayers);
    app.post("/update-score", MatchController.updateScore);
    app.post("/update-extra-run", MatchController.updateExtraRun);
    app.post("/delete-last-ball", MatchController.deleteLastBall);
    
    app.post("/match/finalize", MatchController.finalizeMatch);
};