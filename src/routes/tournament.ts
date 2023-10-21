import { Express } from "express";
import { TournamentEp } from "../end-points/tournament-ep";
import { Authentication } from "../middleware/authentication";

export function initTournamentRoutes(app: Express) {
  app.get(
    "/api/auth/tournaments",
    Authentication.level01UserVerification,
    TournamentEp.getTournaments
  );
  app.get(
    "/api/auth/tournament/:tournamentId",
    Authentication.level01UserVerification,
    TournamentEp.getSingleTournamentValidationRules(),
    TournamentEp.getSingleTournament
  );
  app.post(
    "/api/auth/tournament",
    Authentication.level01UserVerification,
    TournamentEp.createTournament
  );
  app.post(
    "/api/auth/league/:tournamentId",
    Authentication.level01UserVerification,
    TournamentEp.getLeague
  );

  app.delete(
    "/api/auth/delete/tournament",
    Authentication.level01UserVerification,
    TournamentEp.deleteTournament
  );
}
