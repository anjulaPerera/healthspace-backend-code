var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const MatchStatus = require('../enums/MatchStatus');
const MatchType = require('../enums/MatchType');
const { MatchScoreboard } = require('./sub_documents/MatchScoreboardSchema');

const matchSchema = new Schema({
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
})

const Match = mongoose.model('Match', matchSchema);
module.exports = { Match }