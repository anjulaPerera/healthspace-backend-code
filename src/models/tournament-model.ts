import * as mongoose from "mongoose";
import { Types } from "mongoose";
import { Type } from "typescript";

interface Common {
  name: string;
  numberOfTeams: number;
  leagueTotalMatches: number;
  oversPerMatch: number;
  semiFinalMatches: number;
  numberOfTeamMembers: number;
}

export interface DTournament extends Common {}

export interface ITournament extends Common, mongoose.Document {}
