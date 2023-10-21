import Team from "../schemas/team-schema";
import Tournament from "../schemas/tournament-schema";
import Result from "../schemas/result-schema";
import Match from "../schemas/match-schema";

import { NextFunction, Request, Response } from "express";
import { ValidationChain, param, validationResult } from "express-validator";
import { AdminDao } from "../dao/admin-dao";
import { MatchDao } from "../dao/mtach-dao";

export namespace TournamentEp {
  export async function getTournaments(req: Request, res: Response) {
    const userData: any = req.user;
    const userId = userData._id;
    Tournament.find({}, function (err: any, tournaments: any) {
      if (err) {
        return res.status(422).json({
          success: false,
          message: "No tournaments found!",
          data: err,
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        data: tournaments,
      });
    });
  }

  export function getSingleTournamentValidationRules(): ValidationChain[] {
    return [
      param("tournamentId")
        .exists()
        .withMessage("tournamentId is required")
        .isString()
        .withMessage("tournamentId is not a valid string"),
    ];
  }

  export async function getSingleTournament(req: Request, res: Response) {
    //input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendError(errors.array()[0]["msg"]);
    }

    const tournamentId = req.params.tournamentId;

    try {
      await Tournament.findById(
        tournamentId,
        async function (err: any, tournament: any) {
          if (err) {
            return res.status(422).json({
              success: false,
              message: "Invalid tournament id!",
            });
          }

          if (!tournament) {
            return res.status(422).json({
              success: false,
              message: "No tournament found with given id!",
            });
          }

          return res.status(200).json({
            success: true,
            status: 200,
            data: tournament,
          });
        }
      );
    } catch (error) {
      return res.status(422).json({
        success: false,
        message: "Invalid tournament id!",
      });
    }
  }

  export async function createTournament(req: Request, res: Response) {
    const name = req.body.name;
    const numberOfTeams = req.body.numberOfTeams;
    const leagueTotalMatches = req.body.leagueTotalMatches;
    const oversPerMatch = req.body.oversPerMatch;
    const semiFinalMatches = req.body.semiFinalMatches;
    const numberOfTeamMembers = req.body.numberOfTeamMembers;
    const userData: any = req.user;
    const userId = userData._id;

    if (!name) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Name field is missing",
      });
    }

    if (!numberOfTeams) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "NumberOfTeams field is missing",
      });
    }

    if (!leagueTotalMatches) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "LeagueTotalMatches field is missing",
      });
    }

    if (!oversPerMatch) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "OversPerMatch field is missing",
      });
    }

    if (!semiFinalMatches) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "SemiFinalMatches field is missing",
      });
    }

    if (!numberOfTeamMembers) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "NumberOfTeamMembers field is missing",
      });
    }

    if (isNaN(numberOfTeams)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "NumberOfTeams field must be an number",
      });
    }

    if (isNaN(leagueTotalMatches)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "LeagueTotalMatches field must be an number",
      });
    }

    if (isNaN(oversPerMatch)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "OversPerMatch field must be an number",
      });
    }

    // if (isNaN(semiFinalMatches)) {
    //   return res.status(400).json({
    //     success: false,
    //     status: 400,
    //     message: "SemiFinalMatches field must be an number",
    //   });
    // }

    if (isNaN(numberOfTeamMembers)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "NumberOfTeamMembers field must be an number",
      });
    }

    try {
      const exsistsName = await Tournament.findOne({ name: name });

      // if (exsistsName == null) {
      const tournament = new Tournament({
        name: name,
        numberOfTeams: numberOfTeams,
        leagueTotalMatches: leagueTotalMatches,
        oversPerMatch: oversPerMatch,
        semiFinalMatches: semiFinalMatches,
        numberOfTeamMembers: numberOfTeamMembers,
        userId: userId,
      });

      try {
        await tournament.save();
        res.status(201).json({
          success: true,
          status: 201,
          message: "Tournament saved successfully",
          tournamentId: tournament._id,
          name: tournament.name,
          numberOfTeams: tournament.numberOfTeams,
          leagueTotalMatches: tournament.leagueTotalMatches,
          oversPerMatch: tournament.oversPerMatch,
          semiFinalMatches: tournament.semiFinalMatches,
          numberOfTeamMembers: tournament.numberOfTeamMembers,
          userId: tournament.userId,
        });
      } catch (err: any) {
        res.status(500).json({
          success: false,
          status: 500,
          message: err.message,
        });
      }
      // } else {
      //   return res.status(400).json({
      //     success: false,
      //     status: 400,
      //     message: "Tournament name is already taken",
      //   });
      // }
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        status: 500,
        message: err.message,
      });
    }
  }

  export async function getLeague(req: Request, res: Response) {
    const tournamentId = req.params.tournamentId;

    try {
      const exsistsTournament = await Tournament.findById(tournamentId);

      if (!exsistsTournament) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Tournament doesn't exist",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Tournament is not exsists",
      });
    }

    try {
      const matches = await Match.find({ tournamentId: tournamentId });

      const leagueSummaryArr = [];

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
          isTied: result.isTied,
        };

        leagueSummaryArr.push(resultObj);
      }

      res.status(200).json({
        success: true,
        status: 200,
        data: {
          leagueSummary: leagueSummaryArr,
        },
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        status: 500,
        message: err.message,
      });
    }
  }

  //update team name
  export async function deleteTournament(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const checkForMatchesExistence =
        await MatchDao.checkMatchesUnderTournament(req.body.tournamentId);
      if (checkForMatchesExistence.length > 0) {
        return res.sendError(
          "Cannot Delete the Tournament, Matches Are Already Created!"
        );
      }

      const deleteTournament = await MatchDao.deleteTournamentData(
        req.body.tournamentId
      );
      if (!deleteTournament) {
        return res.sendError("Delete Failed!");
      }

      res.sendSuccess("Deleted Successfully!", "Success!");
    } catch (err) {
      return res.sendError("Something Went Wrong!!");
    }
  }
}
