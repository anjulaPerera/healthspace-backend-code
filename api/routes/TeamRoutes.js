module.exports = function(app) {
    const TeamController = require("../controllers/TeamController");
    
    app.get("/teams/:tournament_id", TeamController.getTeamsByTournamentId);
    app.post("/teams/create", TeamController.createTeams);
};