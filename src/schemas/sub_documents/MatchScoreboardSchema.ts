var mongoose = require('mongoose');
import { Schema } from "mongoose";

import PlayerBowls from "./PlayerBowlsSchema";


const MatchScoreboard = new mongoose.Schema({
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

export default MatchScoreboard;