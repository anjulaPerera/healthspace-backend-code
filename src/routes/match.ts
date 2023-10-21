import { Express } from "express";
import { MatchEp } from "../end-points/match-ep";
import { Authentication } from "../middleware/authentication";

export function initMatchRoutes(app: Express) {
  app.post(
    "/api/auth/match/create",
    Authentication.level01UserVerification,
    MatchEp.createMatchValidationRules(),
    MatchEp.createMatch
  );
  app.get(
    "/api/auth/matches-by-tournament/:tournamentId",
    Authentication.level01UserVerification,
    MatchEp.getAllMatchesByTournamentIdValidationRules(),
    MatchEp.getAllMatchesByTournamentId
  );
  app.get(
    "/api/auth/match-details/:matchId",
    Authentication.level01UserVerification,
    MatchEp.getMatchDetailsValidationRules(),
    MatchEp.getMatchDetails
  );

  app.post(
    "/api/auth/update-macth-status",
    Authentication.level01UserVerification,
    MatchEp.updateMatchStatus
  );
  app.post(
    "/api/auth/update-current-players",
    Authentication.level01UserVerification,
    MatchEp.updateCurrentPlayersValidationRules(),
    MatchEp.updateCurrentPlayers
  );
  app.post(
    "/api/auth/update-score",
    Authentication.level01UserVerification,
    MatchEp.updateScore
  );
  app.post(
    "/api/auth/update-extra-run",
    Authentication.level01UserVerification,
    MatchEp.updateExtraRun
  );
  app.post(
    "/api/auth/delete-last-ball",
    Authentication.level01UserVerification,
    MatchEp.deleteLastBall
  );

  app.post(
    "/api/auth/match/finalize",
    Authentication.level01UserVerification,
    MatchEp.finalizeMatch
  );

  app.post(
    "/api/auth/update-teams",
    Authentication.level01UserVerification,
    MatchEp.updateMatchTeams
  );
}
