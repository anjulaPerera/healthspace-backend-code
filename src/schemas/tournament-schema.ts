var mongoose = require("mongoose");
import { Schema, Types } from "mongoose";

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  numberOfTeams: {
    type: Number,
    required: true,
  },
  leagueTotalMatches: {
    type: Number,
    required: true,
  },
  oversPerMatch: {
    type: Number,
    required: true,
  },
  semiFinalMatches: {
    type: Number,
    required: true,
  },
  numberOfTeamMembers: {
    type: Number,
    required: true,
  },
  userId: {
    type: Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Tournament = mongoose.model("Tournament", tournamentSchema);
export default Tournament;
