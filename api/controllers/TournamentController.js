const { Tournament } = require("../models/Tournament");
const { Result } = require("../models/Result");
const { Match } = require("../models/Match");

exports.getTournaments = (req, res) => {    
    Tournament.find({}, function(err, tournaments){
        if (err) {
            return res.status(422).json({
                success: false,
                message: "No tournaments found!",
                data: err
            });
        }

        return res.status(200).json({
            success: true,
            status: 200,
            data: tournaments
          });
    });
};

exports.getSingleTournament = async (req, res) => {
    const tournamentId = req.params.tournamentId;

    try {
        await Tournament.findById(tournamentId, async function(err, tournament) {
            if (err) {
                return res.status(422).json({
                    success: false,
                    message: "Invalid tournament id!"
                });
            }
    
            if(!tournament) {
                return res.status(422).json({
                    success: false,
                    message: "No tournament found with given id!"
                });
            }
    
            return res.status(200).json({
                success: true,
                status: 200,
                data: tournament
            });
        });
    } catch (error) {
        return res.status(422).json({
            success: false,
            message: "Invalid tournament id!"
        });
    }
};

exports.createTournament = async (req, res) => {
    const name = req.body.name
    const numberOfTeams = req.body.numberOfTeams
    const leagueTotalMatches = req.body.leagueTotalMatches
    const oversPerMatch = req.body.oversPerMatch
    const semiFinalMatches = req.body.semiFinalMatches
    const numberOfTeamMembers = req.body.numberOfTeamMembers

    if (!name) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'Name field is missing'
        });
    }

    if (!numberOfTeams) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'NumberOfTeams field is missing'
        });
    }

    if (!leagueTotalMatches) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'LeagueTotalMatches field is missing'
        });
    }

    if (!oversPerMatch) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'OversPerMatch field is missing'
        });
    }

    if (!semiFinalMatches) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'SemiFinalMatches field is missing'
        });
    }

    if (!numberOfTeamMembers) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'NumberOfTeamMembers field is missing'
        });
    }

    if (isNaN(numberOfTeams)) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'NumberOfTeams field must be an number'
        });
    }

    if (isNaN(leagueTotalMatches)) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'LeagueTotalMatches field must be an number'
        });
    }

    if (isNaN(oversPerMatch)) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'OversPerMatch field must be an number'
        });
    }

    if (isNaN(semiFinalMatches)) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'SemiFinalMatches field must be an number'
        });
    }

    if (isNaN(numberOfTeamMembers)) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'NumberOfTeamMembers field must be an number'
        });
    }

    try {
        const exsistsName = await Tournament.findOne({ name: name })

        if (exsistsName == null) {
            const tournament = new Tournament({
                name: name,
                numberOfTeams: numberOfTeams,
                leagueTotalMatches: leagueTotalMatches,
                oversPerMatch: oversPerMatch,
                semiFinalMatches: semiFinalMatches,
                numberOfTeamMembers: numberOfTeamMembers
            })

            try {
                await tournament.save()
                res.status(201).json({
                success: true,
                status: 201,
                    message: 'Tournament saved successfully',
                    tournamentId: tournament._id,
                    name: tournament.name,
                    numberOfTeams: tournament.numberOfTeams,
                    leagueTotalMatches: tournament.leagueTotalMatches,
                    oversPerMatch: tournament.oversPerMatch,
                    semiFinalMatches: tournament.semiFinalMatches,
                    numberOfTeamMembers: tournament.numberOfTeamMembers
                    
                })
            } catch (err) {
                res.status(500).json({
                success: false,
                status: 500,
                message: err.message
                })
            }
        } else {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Tournament name is already taken'
            })
        }
    } catch (err) {
        return res.status(400).json({
        success: false,
        status: 500,
        message: err.message
        })
    }
};

exports.getLeague = async (req, res) => {
    const tournamentId = req.params.tournamentId;

    try {
        const exsistsTournament = await Tournament.findById(tournamentId);
        
        if(!exsistsTournament) {
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
            message: 'Tournament is not exsists'
        });
    }

    try {
        const matches = await Match.find({ tournamentId: tournamentId });

        const leagueSummaryArr = []

        for (let match of matches) {
            const result = await Result.findOne({ matchId: match._id });

            const winningTeam = await Team.findOne({ _id: result.winningTeamId });
            const loosingTeam = await Team.findOne({ _id: result.loosingTeamId });

            var resultObj = {
                matchId: result.matchId,
                winningTeam: winningTeam,
                winningTeamTotal: result.winningTeamTotal,
                winningTeamWickets: result.winningTeamWickets,
                loosingTeam: loosingTeam,
                loosingTeamTotal: result.loosingTeamTotal,
                loosingTeamWickets: result.loosingTeamWickets,
                isTied: result.isTied
            }

            leagueSummaryArr.push(resultObj);
        }

        res.status(200).json({
            success: true,
            status: 200,
            data: {
                leagueSummary: leagueSummaryArr
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};