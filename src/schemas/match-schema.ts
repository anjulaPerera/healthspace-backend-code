import { match } from "assert";

var mongoose = require('mongoose');

import { Schema } from "mongoose";



import MatchStatus from "../enums/MatchStatus";
import MatchType from "../enums/MatchType";
import MatchScoreboard from "./sub_documents/MatchScoreboardSchema";

const matchSchema = new mongoose.Schema(
    {
    tournamentId: {
        type: Schema.Types.ObjectId,
        ref: 'Tournament',
        required: true
    },
    status: {
        type: String,
        enum: MatchStatus,
        default: MatchStatus.NOT_STARTED
    },
    type: {
        type: String,
        enum: MatchType,
        default: MatchType.REGULAR
    },
    teams: [{
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: false
    }],
    tossWin: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: false
    },
    batFirst: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: false
    },
    batFirstScoreboard: MatchScoreboard,
    batSecondScoreboard: MatchScoreboard,
    result: {
        type: Schema.Types.ObjectId,
        ref: 'Result',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}

)
const Match = mongoose.model('Match', matchSchema);

export default Match;
