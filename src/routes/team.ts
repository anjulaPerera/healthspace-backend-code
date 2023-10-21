import { Express } from "express";
import { TeamEp } from "../end-points/team-ep";
import { Authentication } from "../middleware/authentication";

export function initTeamRoutes(app: Express) {
  app.get(
    "/api/auth/teams/:tournament_id",
    Authentication.level01UserVerification,
    TeamEp.getTeamsByTournamentIdValidationRules(),
    TeamEp.getTeamsByTournamentId
  );
  app.post(
    "/api/auth/teams/create",
    Authentication.level01UserVerification,
    TeamEp.createTeamsValidationRules(),
    TeamEp.createTeams
  );

  app.post(
    "/api/auth/update/team-name",
    Authentication.level01UserVerification,
    //TeamEp.createTeamsValidationRules(),
    TeamEp.updateTeamName
  );

  app.post(
    "/api/auth/update/team-members",
    Authentication.level01UserVerification,
    //TeamEp.createTeamsValidationRules(),
    TeamEp.updateTeamMates
  );

  app.delete(
    "/api/auth/delete/team",
    Authentication.level01UserVerification,
    //TeamEp.createTeamsValidationRules(),
    TeamEp.deleteTeam
  );
}
