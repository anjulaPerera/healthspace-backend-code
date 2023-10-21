var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const resultSchema = new Schema({
    matchId: {
        type: Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    winningTeamId: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: false
    },
    winningTeamTotal: {
        type: Number,
        required: false
    },
    winningTeamWickets: {
        type: Number,
        required: false
    },
    loosingTeamId: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: false
    },
    loosingTeamTotal: {
        type: Number,
        required: false
    },
    loosingTeamWickets: {
        type: Number,
        required: false
    },
    isTied: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Result = mongoose.model('Result', resultSchema)
module.exports = { Result }
