import { NextFunction, Request, Response } from "express";

import Tournament from "../schemas/tournament-schema";
import Match from "../schemas/match-schema";
import Team from "../schemas/team-schema";
import Result from "../schemas/result-schema";
import RunStatus from "../enums/RunStatus";
import MatchStatus from "../enums/MatchStatus";
import { DPlayerBowls } from "../models/player-bowls-model";
import {
  ValidationChain,
  check,
  param,
  validationResult,
} from "express-validator";
import { Validations } from "../common/validation";
import Player from "../schemas/player-schema";
import { MatchDao } from "../dao/mtach-dao";

export namespace MatchEp {
  //createMatch validation rules
  export function createMatchValidationRules(): ValidationChain[] {
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
      check("type")
        .exists()
        .withMessage("type is required")
        .isString()
        .withMessage("type is not a String"),
    ];
  }

  export async function createMatch(req: Request, res: Response) {
    //input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendError(errors.array()[0]["msg"]);
    }

    const tournamentId = req.body.tournamentId;
    const match = req.body;

    if (!tournamentId) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "TournamentId field is missing.",
      });
    }

    try {
      const tournamentExsists = await Tournament.findById(tournamentId);

      if (!tournamentExsists) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Tournament doesn't exsists.",
        });
      }

      if (!match.type) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Type field in matches is missing.",
        });
      }

      if (!match.teams) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Teams field is missing.",
        });
      }

      const matchObj = new Match({
        tournamentId: tournamentId,
        teams: match.teams,
        type: match.type,
      });

      await matchObj.save();

      res.status(200).json({
        success: true,
        status: 200,
        message: "New match is created successfully.",
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Error Occured.",
        data: err,
      });
    }
  }

  //createMatch validation rules
  export function getAllMatchesByTournamentIdValidationRules(): ValidationChain[] {
    return [
      param("tournamentId")
        .exists()
        .withMessage("tournamentId is required")
        .isString()
        .withMessage("tournamentId is not a valid string"),
    ];
  }

  export async function getAllMatchesByTournamentId(
    req: Request,
    res: Response
  ) {
    //input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendError(errors.array()[0]["msg"]);
    }

    const tournamentId = req.params.tournamentId;

    if (!tournamentId) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "TournamentId field is missing",
      });
    }

    var allMatches = await Match.find({ tournamentId: tournamentId }).populate([
      {
        path: "teams",
        populate: { path: "players" },
      },
      {
        path: "tournamentId",
      },
      {
        path: "result",
      },
    ]);

    return res.status(200).json({
      success: true,
      status: 200,
      data: allMatches,
    });
  }

  //createMatch validation rules
  export function getMatchDetailsValidationRules(): ValidationChain[] {
    return [
      param("matchId")
        .exists()
        .withMessage("matchId is required")
        .isString()
        .withMessage("matchId is not a valid string"),
    ];
  }

  export async function getMatchDetails(req: Request, res: Response) {
    //input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendError(errors.array()[0]["msg"]);
    }

    const matchId = req.params.matchId;

    try {
      var matchDetails = await Match.findOne({ _id: matchId }).populate([
        {
          path: "teams",
          populate: { path: "players" },
        },
        {
          path: "tournamentId",
        },
        {
          path: "result",
        },
        // {
        //   path: "batFirstScoreboard.currentlyBowling",
        //   model: Player,
        // },
        // {
        //   path: "batSecondScoreboard.currentlyBowling",
        //   model: Player,
        // },
      ]);

      return res.status(200).json({
        success: true,
        status: 200,
        data: matchDetails,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Scoreboard is not exsists",
      });
    }
  }

  export function updateMatchStatusValidationRules(): ValidationChain[] {
    return [
      check("matchId")
        .notEmpty()
        .withMessage("matchId is required")
        .isString()
        .withMessage("matchId is not a String"),
      Validations.objectId("matchId"),
      check("tossWin")
        .notEmpty()
        .withMessage("tossWin is required")
        .isString()
        .withMessage("tossWin is not a String"),
      Validations.objectId("tossWin"),
      check("batFirst")
        .notEmpty()
        .withMessage("batFirst is required")
        .isString()
        .withMessage("batFirst is not a String"),
      Validations.objectId("batFirst"),
      check("status")
        .exists()
        .withMessage("status is required")
        .isString()
        .withMessage("status is not a String"),
    ];
  }

  export async function updateMatchStatus(req: Request, res: Response) {
    //input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendError(errors.array()[0]["msg"]);
    }

    var matchData = req.body;

    try {
      var match = await Match.findOne({ _id: matchData.matchId });

      if (!match) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Match doesn't exist.",
        });
      }

      if (
        match.status == MatchStatus.MATCH_TIED ||
        match.status == MatchStatus.BAT_FIRST_WIN ||
        match.status == MatchStatus.BALL_FIRST_WIN
      ) {
        return res.status(200).json({
          success: true,
          status: 200,
          message: "Match is finalized.",
        });
      }

      match.status = matchData.status;
      match.tossWin = matchData.tossWin;
      match.batFirst = matchData.batFirst;

      var matchUpdated = await Match.updateOne(
        {
          _id: matchData.matchId,
        },
        match,
        { upsert: true }
      );

      if (matchUpdated) {
        return res.status(200).json({
          success: true,
          status: 200,
          message: "Match status is updated.",
        });
      } else {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Match update failed.",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Match update failed.",
        data: err,
      });
    }
  }

  export function updateCurrentPlayersValidationRules(): ValidationChain[] {
    return [
      check("matchId")
        .notEmpty()
        .withMessage("matchId is required")
        .isString()
        .withMessage("matchId is not a String"),
      Validations.objectId("matchId"),
      check("battingTeamId")
        .notEmpty()
        .withMessage("battingTeamId is required")
        .isString()
        .withMessage("battingTeamId is not a String"),
      Validations.objectId("battingTeamId"),
      check("currentlyBowlingPlayer")
        .notEmpty()
        .withMessage("currentlyBowlingPlayer is required")
        .isString()
        .withMessage("currentlyBowlingPlayer is not a String"),
      Validations.objectId("batFirst"),
      check("currentlyBattingPlayers")
        .optional()
        .isArray()
        .withMessage("currentlyBattingPlayers is not an Array")
        .notEmpty()
        .withMessage("currentlyBattingPlayers Cannot be Empty Array"),
    ];
  }

  export async function updateCurrentPlayers(req: Request, res: Response) {
    // //input validation
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.sendError(errors.array()[0]["msg"]);
    // }

    var matchData = req.body;
    try {
      var match = await Match.findOne({ _id: matchData.matchId });

      if (!match) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Match doesn't exist.",
        });
      }

      if (
        match.status == MatchStatus.MATCH_TIED ||
        match.status == MatchStatus.BAT_FIRST_WIN ||
        match.status == MatchStatus.BALL_FIRST_WIN
      ) {
        return res.status(200).json({
          success: true,
          status: 200,
          message: "Match is already finalized.",
        });
      }

      var battingTeam = await Team.findOne({ _id: matchData.battingTeamId });

      if (!battingTeam) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Batting team doesn't exist.",
        });
      }

      if (!match.batFirst) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Toss should played first & update batting first team.",
        });
      }

      if (!match.batFirstScoreboard) {
        match.batFirstScoreboard = {};
      }

      if (!match.batSecondScoreboard) {
        match.batSecondScoreboard = {};
      }

      if (match.batFirst.equals(matchData.battingTeamId)) {
        match.batFirstScoreboard.currentlyBatting =
          matchData.currentlyBattingPlayers;
        match.batFirstScoreboard.currentlyBowling =
          matchData.currentlyBowlingPlayer;
      } else {
        match.batSecondScoreboard.currentlyBatting =
          matchData.currentlyBattingPlayers;
        match.batSecondScoreboard.currentlyBowling =
          matchData.currentlyBowlingPlayer;
      }

      var matchUpdated = await Match.updateOne(
        {
          _id: matchData.matchId,
        },
        match,
        { upsert: true }
      );

      if (matchUpdated) {
        return res.status(200).json({
          success: true,
          status: 200,
          message: "Current players are updated.",
        });
      } else {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Match update failed.",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Match update failed.2",
        data: err,
      });
    }
  }

  export async function updateScore(req: Request, res: Response) {
    var matchData = req.body;

    try {
      var match = await Match.findOne({ _id: matchData.matchId }).populate(
        "tournamentId"
      );

      if (!match) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Match doesn't exist",
        });
      }

      if (
        match.status == MatchStatus.MATCH_TIED ||
        match.status == MatchStatus.BAT_FIRST_WIN ||
        match.status == MatchStatus.BALL_FIRST_WIN
      ) {
        return res.status(200).json({
          success: true,
          status: 200,
          message: "Match is already finalized.",
        });
      }

      var battingTeam = await Team.findOne({ _id: matchData.battingTeamId });

      if (!battingTeam) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Batting team doesn't exist.",
        });
      }

      var scoreboardData;

      if (match.batFirst.equals(matchData.battingTeamId)) {
        scoreboardData = match.batFirstScoreboard;
      } else {
        scoreboardData = match.batSecondScoreboard;
      }

      if (!scoreboardData) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Plaease update currently batting players first.",
        });
      } else {
        if (scoreboardData.currentlyBatting.length == 0) {
          return res.status(400).json({
            success: false,
            status: 400,
            message: "Plaease update currently batting players first.",
          });
        }
      }

      var totalExtrasSoFar = scoreboardData.playerBowls.filter(function (
        bowl: any
      ) {
        return (
          bowl.status === RunStatus.WIDE || bowl.status === RunStatus.NO_BALL
        );
      });

      if (
        scoreboardData.playerBowls.length >=
        match.tournamentId.oversPerMatch * 6 + totalExtrasSoFar.length
      ) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "All overs completed for this inning.",
        });
      }

      var newPlayerBowl: DPlayerBowls;

      if (scoreboardData.playerBowls.length == 0) {
        newPlayerBowl = {
          ballNumber: 1,
          over: 1,
          batsmanId: matchData.currentBattingPlayer,
          bowlerId: matchData.currentBowlingPlayer,
          runs: matchData.runs,
          boundary: matchData.boundary,
          status: matchData.status,
        };
      } else {
        var pb = scoreboardData.playerBowls.sort(function (a: any, b: any) {
          return b.createdAt - a.createdAt;
        });

        var extraRuns = scoreboardData.playerBowls.filter(function (bowl: any) {
          return (
            (bowl.status === RunStatus.WIDE ||
              bowl.status === RunStatus.NO_BALL) &&
            pb[0].over === bowl.over
          );
        });

        if (extraRuns.length == 0) {
          if (pb[0].ballNumber >= 6) {
            newPlayerBowl = {
              ballNumber: 1,
              over: pb[0].over + 1,
              batsmanId: matchData.currentBattingPlayer,
              bowlerId: matchData.currentBowlingPlayer,
              runs: matchData.runs,
              boundary: matchData.boundary,
              status: matchData.status,
            };
          } else {
            newPlayerBowl = {
              ballNumber: pb[0].ballNumber + 1,
              over: pb[0].over,
              batsmanId: matchData.currentBattingPlayer,
              bowlerId: matchData.currentBowlingPlayer,
              runs: matchData.runs,
              boundary: matchData.boundary,
              status: matchData.status,
            };
          }
        } else {
          if (pb[0].ballNumber - extraRuns.length >= 6) {
            newPlayerBowl = {
              ballNumber: 1,
              over: pb[0].over + 1,
              batsmanId: matchData.currentBattingPlayer,
              bowlerId: matchData.currentBowlingPlayer,
              runs: matchData.runs,
              boundary: matchData.boundary,
              status: matchData.status,
            };
          } else {
            newPlayerBowl = {
              ballNumber: pb[0].ballNumber + 1,
              over: pb[0].over,
              batsmanId: matchData.currentBattingPlayer,
              bowlerId: matchData.currentBowlingPlayer,
              runs: matchData.runs,
              boundary: matchData.boundary,
              status: matchData.status,
            };
          }
        }
      }

      if (newPlayerBowl) {
        scoreboardData.playerBowls.push(newPlayerBowl);
      }

      if (match.batFirst.equals(matchData.battingTeamId)) {
        match.batFirstScoreboard = scoreboardData;
      } else {
        match.batSecondScoreboard = scoreboardData;
      }

      var matchUpdated = await Match.updateOne(
        {
          _id: matchData.matchId,
        },
        match,
        { upsert: true }
      );

      if (matchUpdated) {
        return res.status(200).json({
          success: true,
          status: 200,
          message: "Match score is updated.",
        });
      } else {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Match update failed.",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Match update failed.",
        data: err,
      });
    }
  }

  export async function updateExtraRun(req: Request, res: Response) {
    var matchData = req.body;

    try {
      var match = await Match.findOne({ _id: matchData.matchId }).populate(
        "tournamentId"
      );

      // if (matchData.batsmanId === undefined) {
      //   return res.status(400).json({
      //     success: false,
      //     status: 400,
      //     message: "Batsmen Id doesnt exist!",
      //   });
      // }

      if (!match) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Match doesn't exist",
        });
      }

      if (
        match.status == MatchStatus.MATCH_TIED ||
        match.status == MatchStatus.BAT_FIRST_WIN ||
        match.status == MatchStatus.BALL_FIRST_WIN
      ) {
        return res.status(200).json({
          success: true,
          status: 200,
          message: "Match is already finalized.",
        });
      }

      var battingTeam = await Team.findOne({ _id: matchData.battingTeamId });

      if (!battingTeam) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Batting team doesn't exist.",
        });
      }

      var scoreboardData;

      if (match.batFirst.equals(matchData.battingTeamId)) {
        scoreboardData = match.batFirstScoreboard;
      } else {
        scoreboardData = match.batSecondScoreboard;
      }

      if (!scoreboardData) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Plaease update currently batting players first.",
        });
      } else {
        if (scoreboardData.currentlyBatting.length == 0) {
          return res.status(400).json({
            success: false,
            status: 400,
            message: "Plaease update currently batting players first.",
          });
        }
      }

      var totalExtrasSoFar = scoreboardData.playerBowls.filter(function (
        bowl: any
      ) {
        return (
          bowl.status === RunStatus.WIDE || bowl.status === RunStatus.NO_BALL
        );
      });

      if (
        scoreboardData.playerBowls.length >=
        match.tournamentId.oversPerMatch * 6 + totalExtrasSoFar.length
      ) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "All overs completed for this inning.",
        });
      }

      var newPlayerBowl: DPlayerBowls;

      if (scoreboardData.playerBowls.length == 0) {
        newPlayerBowl = {
          ballNumber: 1,
          over: 1,
          bowlerId: matchData.currentBowlingPlayer,
          runs: matchData.runs,
          boundary: matchData.boundary,
          status: matchData.status,
          batsmanId: matchData.batsmanId,
        };
      } else {
        var pb = scoreboardData.playerBowls.sort(function (a: any, b: any) {
          return b.createdAt - a.createdAt;
        });

        if (matchData.status == RunStatus.LEG_BYE) {
          var extraRuns = scoreboardData.playerBowls.filter(function (
            bowl: any
          ) {
            return (
              (bowl.status === RunStatus.WIDE ||
                bowl.status === RunStatus.NO_BALL) &&
              pb[0].over === bowl.over
            );
          });

          if (extraRuns.length == 0) {
            if (pb[0].ballNumber >= 6) {
              newPlayerBowl = {
                ballNumber: 1,
                over: pb[0].over + 1,
                bowlerId: matchData.currentBowlingPlayer,
                runs: matchData.runs,
                boundary: matchData.boundary,
                status: matchData.status,
                batsmanId: matchData.batsmanId,
              };
            } else {
              newPlayerBowl = {
                ballNumber: pb[0].ballNumber + 1,
                over: pb[0].over,
                bowlerId: matchData.currentBowlingPlayer,
                runs: matchData.runs,
                boundary: matchData.boundary,
                status: matchData.status,
                batsmanId: matchData.batsmanId,
              };
            }
          } else {
            if (pb[0].ballNumber - extraRuns.length >= 6) {
              newPlayerBowl = {
                ballNumber: 1,
                over: pb[0].over + 1,
                bowlerId: matchData.currentBowlingPlayer,
                runs: matchData.runs,
                boundary: matchData.boundary,
                status: matchData.status,
                batsmanId: matchData.batsmanId,
              };
            } else {
              newPlayerBowl = {
                ballNumber: pb[0].ballNumber + 1,
                over: pb[0].over,
                bowlerId: matchData.currentBowlingPlayer,
                runs: matchData.runs,
                boundary: matchData.boundary,
                status: matchData.status,
                batsmanId: matchData.batsmanId,
              };
            }
          }
        } else {
          newPlayerBowl = {
            ballNumber: pb[0].ballNumber + 1,
            over: pb[0].over,
            bowlerId: matchData.currentBowlingPlayer,
            runs: matchData.runs,
            boundary: matchData.boundary,
            status: matchData.status,
            batsmanId: matchData.batsmanId,
          };
        }
      }

      if (newPlayerBowl) {
        scoreboardData.playerBowls.push(newPlayerBowl);
      }

      if (match.batFirst.equals(matchData.battingTeamId)) {
        match.batFirstScoreboard = scoreboardData;
      } else {
        match.batSecondScoreboard = scoreboardData;
      }

      var matchUpdated = await Match.updateOne(
        {
          _id: matchData.matchId,
        },
        match,
        { upsert: true }
      );

      if (matchUpdated) {
        return res.status(200).json({
          success: true,
          status: 200,
          message: "Match score is updated.",
        });
      } else {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Match update failed.",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Match update failed.",
        data: err,
      });
    }
  }

  export async function deleteLastBall(req: Request, res: Response) {
    var matchData = req.body;

    try {
      var match = await Match.findOne({ _id: matchData.matchId }).populate(
        "tournamentId"
      );

      if (!match) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Match doesn't exist",
        });
      }

      if (
        match.status == MatchStatus.MATCH_TIED ||
        match.status == MatchStatus.BAT_FIRST_WIN ||
        match.status == MatchStatus.BALL_FIRST_WIN
      ) {
        return res.status(200).json({
          success: true,
          status: 200,
          message: "Match is already finalized.",
        });
      }

      var battingTeam = await Team.findOne({ _id: matchData.battingTeamId });

      if (!battingTeam) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Batting team doesn't exist.",
        });
      }

      if (!match.batFirstScoreboard) {
        match.batFirstScoreboard = {};
      }

      if (!match.batSecondScoreboard) {
        match.batSecondScoreboard = {};
      }

      if (match.batFirst.equals(matchData.battingTeamId)) {
        var pb = match.batFirstScoreboard.playerBowls.sort(function (
          a: any,
          b: any
        ) {
          return a.createdAt - b.createdAt;
        });

        pb.pop();

        match.batFirstScoreboard.playerBowls = pb;
      } else {
        var pb = match.batSecondScoreboard.playerBowls.sort(function (
          a: any,
          b: any
        ) {
          return a.createdAt - b.createdAt;
        });

        pb.pop();

        match.batSecondScoreboard.playerBowls = pb;
      }

      var matchUpdated = await Match.updateOne(
        {
          _id: matchData.matchId,
        },
        match,
        { upsert: true }
      );

      if (matchUpdated) {
        return res.status(200).json({
          success: true,
          status: 200,
          message: "Deleted last ball successfully.",
        });
      } else {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Match update failed.",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Match update failed.",
        data: err,
      });
    }
  }

  export async function finalizeMatch(req: Request, res: Response) {
    var matchData = req.body;

    try {
      var match = await Match.findOne({ _id: matchData.matchId }).populate(
        "tournamentId"
      );

      if (!match) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Match doesn't exist",
        });
      }

      if (
        match.status == MatchStatus.MATCH_TIED ||
        match.status == MatchStatus.BAT_FIRST_WIN ||
        match.status == MatchStatus.BALL_FIRST_WIN
      ) {
        return res.status(200).json({
          success: true,
          status: 200,
          message: "Match is already finalized.",
        });
      }

      if (!match.batFirstScoreboard) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "First team scoreboard not created yet!",
        });
      } else {
        if (match.batFirstScoreboard.playerBowls.length == 0) {
          return res.status(400).json({
            success: false,
            status: 400,
            message: "First team scoreboard doens't have any balls bowled!",
          });
        }
      }

      if (!match.batSecondScoreboard) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Second team scoreboard not created yet!",
        });
      } else {
        if (match.batSecondScoreboard.playerBowls.length == 0) {
          return res.status(400).json({
            success: false,
            status: 400,
            message: "Second team scoreboard doens't have any balls bowled!",
          });
        }
      }

      var batFirstBowls = match.batFirstScoreboard.playerBowls;
      var batSecondBowls = match.batSecondScoreboard.playerBowls;

      var batFirstTotal = 0;
      var batFirstWickets = 0;

      batFirstBowls.forEach((b: any) => {
        if (b.status == RunStatus.WICKET) {
          batFirstWickets = batFirstWickets + 1;
        } else {
          batFirstTotal = batFirstTotal + b.runs;
        }
      });

      var batSecondTotal = 0;
      var batSecondWickets = 0;

      batSecondBowls.forEach((b: any) => {
        if (b.status == RunStatus.WICKET) {
          batSecondWickets = batSecondWickets + 1;
        } else {
          batSecondTotal = batSecondTotal + b.runs;
        }
      });

      var batSecondTeam = match.teams.filter(function (t: any) {
        return !t.equals(match.batFirst);
      });

      var finalResult;

      if (batFirstTotal == batSecondTotal) {
        finalResult = new Result({
          matchId: match._id,
          isTied: true,
        });

        match.status = MatchStatus.MATCH_TIED;
      } else if (batFirstTotal > batSecondTotal) {
        finalResult = new Result({
          matchId: match._id,
          winningTeamId: match.batFirst,
          winningTeamTotal: batFirstTotal,
          winningTeamWickets: batFirstWickets,
          loosingTeamId: batSecondTeam[0],
          loosingTeamTotal: batSecondTotal,
          loosingTeamWickets: batSecondWickets,
        });

        match.status = MatchStatus.BAT_FIRST_WIN;
      } else {
        finalResult = new Result({
          matchId: match._id,
          winningTeamId: batSecondTeam[0],
          winningTeamTotal: batSecondTotal,
          winningTeamWickets: batSecondWickets,
          loosingTeamId: match.batFirst,
          loosingTeamTotal: batFirstTotal,
          loosingTeamWickets: batFirstWickets,
        });

        match.status = MatchStatus.BALL_FIRST_WIN;
      }

      await finalResult.save();
      await match.save();

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Match is finalized.",
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        status: 500,
        message: err.message,
      });
    }
  }

  export async function updateMatchTeams(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const matchId = req.body.matchId;
      const team01 = req.body.team01;
      const team02 = req.body.team02;

      const getMatch = await MatchDao.getMatchData(matchId);

      if (!getMatch) {
        return res.sendError("No match Found");
      }

      if (getMatch.status === MatchStatus.NOT_STARTED) {
        const updateMatch = await MatchDao.updateMatchTeams(
          matchId,
          team01,
          team02
        );
        if (!updateMatch) {
          return res.sendError("Match Update Failed");
        }
        res.sendSuccess(updateMatch, "Successfully Updated!");
      } else {
        return res.sendError("Invaid Match Status to Update");
      }
    } catch (err) {
      return res.sendError(err);
    }
  }
}
