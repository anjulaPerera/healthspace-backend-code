const { Tournament } = require("../models/Tournament");
const { Player } = require("../models/Player");
const { Team } = require("../models/Team");

exports.getTeamsByTournamentId = async (req, res) => {
    const tournamentId = req.params.tournament_id;
  
    console.log("req.params", req.params);
    console.log("req.params.tournamentId", req.params.tournament_id);
    if (!tournamentId) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'TournamentId field is missing'
        });
    }

    try {
        const tournamentExsists = await Tournament.findById(tournamentId);

        if(!tournamentExsists) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Tournament doesn't exist"
            });
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'Tournament is not exist'
        });
    }

    var teams = await Team.find({tournamentId}).populate("players");
    
    return res.status(200).json({
        success: true,
        message: "Teams Found!",
        data: teams
    });
};

exports.createTeams = async (req, res) => {
    const tournamentId = req.body.tournamentId;
    const teams = req.body.teams;

    if (!tournamentId) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'TournamentId field is missing'
        });
    }

    try {
        const tournamentExsists = await Tournament.findById(tournamentId);

        if(!tournamentExsists) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Tournament doesn't exist"
            });
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'Tournament is not exist'
        });
    }

    if (!teams) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'Teams field is missing'
        });
    }

    if (!Array.isArray(teams)) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'Teams field must be an array'
        });
    }

    for await (const team of teams) {
        var newTeam = new Team({
            name: team.name,
            tournamentId: tournamentId
        });

        newTeam.save((err, t) => {
            if (err) {
                return res.status(422).json({
                    success: false,
                    message: "Unable to create team!",
                    data: err
                });
            } else {
                for (const player of team.players) {
                    var newPlayer = new Player({
                        name: player,
                        teamId: t._id
                    });
            
                    newPlayer.save((err, service) => {
                        if (err) {
                            return res.status(422).json({
                                success: false,
                                message: "Unable to create player!",
                                data: err
                            });
                        } else {
                           console.log('Player ' + player + ' saved on ' + t.name+ '\n\n');
                        }
                    });
                }
            }
        });
    }

    return res.status(200).json({
        success: true,
        status: 200,
        message: 'Teams Crerated Successfully!'
    })
};