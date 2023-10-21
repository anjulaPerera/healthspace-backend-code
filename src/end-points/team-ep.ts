import Team from "../schemas/team-schema";
import Player from "../schemas/player-schema";
import Tournament from "../schemas/tournament-schema";

import { NextFunction, Request, Response } from "express";
import {
  ValidationChain,
  check,
  param,
  validationResult,
} from "express-validator";
import { Validations } from "../common/validation";
import { MatchDao } from "../dao/mtach-dao";
import { Types } from "mongoose";

export namespace TeamEp {
  export function getTeamsByTournamentIdValidationRules(): ValidationChain[] {
    return [
      param("tournament_id")
        .exists()
        .withMessage("tournament_id is required")
        .isString()
        .withMessage("tournament_id is not a valid string"),
    ];
  }

  export async function getTeamsByTournamentId(req: Request, res: Response) {
    //input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendError(errors.array()[0]["msg"]);
    }

    const tournamentId = req.params.tournament_id;

    console.log("req.params", req.params);
    console.log("req.params.tournamentId", req.params.tournament_id);
    if (!tournamentId) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "TournamentId field is missing",
      });
    }

    try {
      const tournamentExsists = await Tournament.findById(tournamentId);

      if (!tournamentExsists) {
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
        message: "Tournament is not exist",
      });
    }

    var teams = await Team.find({ tournamentId }).populate("players");

    return res.status(200).json({
      success: true,
      message: "Teams Found!",
      data: teams,
    });
  }

  //createMatch validation rules
  export function createTeamsValidationRules(): ValidationChain[] {
    return [
      check("tournamentId")
        .notEmpty()
        .withMessage("tournamentId is required")
        .isString()
        .withMessage("tournamentId is not a String"),
      Validations.objectId("tournamentId"),
      check("teams")
        .optional()
        .isArray()
        .withMessage("teams is not an Array")
        .notEmpty()
        .withMessage("teams Cannot be Empty Array"),
    ];
  }

  export async function createTeams(req: Request, res: Response) {
    //input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendError(errors.array()[0]["msg"]);
    }

    const tournamentId = req.body.tournamentId;
    const teams = req.body.teams;

    if (!tournamentId) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "TournamentId field is missing",
      });
    }

    try {
      const tournamentExsists = await Tournament.findById(tournamentId);

      if (!tournamentExsists) {
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
        message: "Tournament is not exist",
      });
    }

    if (!teams) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Teams field is missing",
      });
    }

    if (!Array.isArray(teams)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Teams field must be an array",
      });
    }

    for await (const team of teams) {
      var newTeam = new Team({
        name: team.name,
        tournamentId: tournamentId,
      });

      newTeam.save((err: any, t: any) => {
        if (err) {
          return res.status(422).json({
            success: false,
            message: "Unable to create team!",
            data: err,
          });
        } else {
          let playerArray: any = [];
          for (const player of team.players) {
            const newData = {
              name: player,
              teamId: t._id,
            };

            playerArray.push(newData);
          }

          Player.insertMany(playerArray, (err: any, service: any) => {
            if (err) {
              return res.status(422).json({
                success: false,
                message: "Unable to create player!",
                data: err,
              });
            } else {
              console.log("Players added");
            }
          });
        }
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Teams Crerated Successfully!",
    });
  }

  //update team name
  export async function updateTeamName(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const teamId = req.body.teamId;
      const teamName = req.body.teamName !== null ? req.body.teamName : null;

      if (teamName !== null) {
        const updateTeamName = await MatchDao.updateTeamName(teamId, teamName);
        if (!updateTeamName) {
          return res.sendError("Update Name Failed");
        }
        res.sendSuccess(updateTeamName, "Team Name Updated!");
      }
    } catch (err) {
      return res.sendError("Something Went Wrong!!");
    }
  }

  //update team name
  export async function updateTeamMates(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const teamId = req.body.teamId;
      const newTeamData = req.body.newTeamData;

      //check for availability to delete team
      const availability = await checkToAllowModificationOfTeams(teamId);
      if (availability === false) {
        return res.sendError(
          "Update Failed, Matches are Ongoing or Finalized related to the team!"
        );
      }

      if (newTeamData.length > 0) {
        //remove existing team members
        const removeTeamMembers = await MatchDao.removeTeamMembers(teamId);
        if (!removeTeamMembers) {
          return res.sendError("Removing Members Failed");
        }

        //add new team Members
        let playerArray: any = [];
        for (const player of newTeamData) {
          const newData = {
            name: player,
            teamId: teamId,
          };

          playerArray.push(newData);
        }

        const addTeamMates = await MatchDao.addNewMembers(playerArray);
        if (!addTeamMates) {
          return res.sendError("Adding New Members Failed!");
        }
        res.sendSuccess(addTeamMates, "Team Members Updated!");
      }
    } catch (err) {
      return res.sendError("Something Went Wrong!!");
    }
  }

  //update team name
  export async function deleteTeam(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const teamId = req.body.teamId;

      //check for availability to delete team
      const availability = await checkToAllowModificationOfTeams(teamId);
      if (availability === false) {
        return res.sendError(
          "Delete Failed, Matches are Ongoing or Finalized related to the team!"
        );
      }

      const deleteTeam = await MatchDao.deleteTeam(teamId);
      if (!deleteTeam) {
        return res.sendError("Delete Failed!");
      }

      //remove existing team members
      const removeTeamMembers = await MatchDao.removeTeamMembers(teamId);
      if (!removeTeamMembers) {
        return res.sendError("Removing Members Failed");
      }

      res.sendSuccess("Deleted Successfully!", "Team Members Updated!");
    } catch (err) {
      return res.sendError("Something Went Wrong!!");
    }
  }

  //update team name
  export async function checkToAllowModificationOfTeams(
    teamId: Types.ObjectId
  ) {
    try {
      const checkIfThereAreOngoingOrFinalizedMatches =
        await MatchDao.checkMaychesForStatusOfOngoingOrFinalized(teamId);

      if (checkIfThereAreOngoingOrFinalizedMatches.length > 0) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      return true;
    }
  }
}
