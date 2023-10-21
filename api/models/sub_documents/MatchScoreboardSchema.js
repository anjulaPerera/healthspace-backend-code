var mongoose = require('mongoose');
const { PlayerBowls } = require('./PlayerBowlsSchema');
var Schema = mongoose.Schema;

const MatchScoreboard = new Schema({
    currentlyBatting: [{
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: false
    }],
    currentlyBowling: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: false
    },
    playerBowls: [PlayerBowls],
    totalRuns: {
        type: Number,
        required: false
    },
    totalWickets: {
        type: Number,
        required: false
    },
    isPreviousBallWideORNo: {
        type: Boolean,
        default: false,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = { MatchScoreboard }