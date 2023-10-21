var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const RunStatus = require('../../enums/RunStatus');

const PlayerBowls = new Schema({
    ballNumber: {
        type: Number,
        required: false
    },
    over: {
        type: Number,
        required: false
    },
    batsmanId: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: false
    },
    bowlerId: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: false
    },
    runs: {
        type: Number,
        required: false
    },
    status: {
        type: String,
        enum: RunStatus,
        default: RunStatus.RUNS
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = { PlayerBowls }