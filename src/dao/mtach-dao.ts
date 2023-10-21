import { Types } from "mongoose";
import { ApplicationError } from "../common/application-error";
import Match from "../schemas/match-schema";
import Team from "../schemas/team-schema";
import Player from "../schemas/player-schema";
import MatchType from "../enums/MatchType";
import MatchStatus from "../enums/MatchStatus";

export namespace MatchDao {
  export async function updateMatchTeams(
    matchId: Types.ObjectId,
    team01: Types.ObjectId,
    team02: Types.ObjectId
  ): Promise<any> {
    let updateMatch: any = await Match.findOneAndUpdate(
      { _id: matchId },
      {
        $set: {
          teams: [team01, team02],
        },
      },
      { new: true }
    );

    return updateMatch;
  }

  export async function getMatchData(matchId: Types.ObjectId) {
    const matchFound = await Match.findById(matchId);
    return matchFound;
  }

  export async function updateTeamName(
    teamId: Types.ObjectId,
    name: string
  ): Promise<any> {
    let updateTeam: any = await Team.findOneAndUpdate(
      { _id: teamId },
      {
        $set: {
          name: name,
        },
      },
      { new: true }
    );

    return updateTeam;
  }

  export async function addNewTeamMembers(
    teamId: Types.ObjectId,
    name: string
  ): Promise<any> {
    let updateTeam: any = await Team.findOneAndUpdate(
      { _id: teamId },
      {
        $set: {
          name: name,
        },
      },
      { new: true }
    );

    return updateTeam;
  }

  export async function removeTeamMembers(
    teamId: Types.ObjectId
  ): Promise<any> {
    let deleteMembers: any = await Player.deleteMany({
      teamId: teamId,
    });

    return deleteMembers;
  }

  export async function addNewMembers(members: any): Promise<any> {
    const res = await Player.insertMany(members);

    return res;
  }

  export async function deleteTeam(teamId: Types.ObjectId): Promise<any> {
    let deleteTeam: any = await Team.deleteOne({ _id: teamId });

    return deleteTeam;
  }

  export async function checkMaychesForStatusOfOngoingOrFinalized(
    teamId: Types.ObjectId
  ) {
    const matchFound = await Match.find({
      teams: { $in: teamId },
      $or: [
        { status: MatchStatus.ONGOING },
        { status: MatchStatus.BALL_FIRST_WIN },
        { status: MatchStatus.BAT_FIRST_WIN },
        { status: MatchStatus.MATCH_TIED },
      ],
    });
    return matchFound;
  }

  export async function checkMatchesUnderTournament(
    tournamentId: Types.ObjectId
  ) {
    const res = await Match.find({ tournamentId: tournamentId });
    return res;
  }

  export async function deleteTournamentData(
    tournamentId: Types.ObjectId
  ): Promise<any> {
    let res: any = await Team.deleteOne({ _id: tournamentId });

    return res;
  }
}
