var mongoose = require('mongoose');
import { Schema } from "mongoose";

const runSchema = new mongoose.Schema(
    {
    bowlNumber: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: false
    },
    runs: [{
        type: Number,
        required: false
    }],
    two: {
        type: Number,
        required: false
    },
    three: {
        type: Number,
        required: false
    },
    four: {
        type: Number,
        required: false
    },
    five: {
        type: Number,
        required: false
    },
    six: {
        type: Number,
        required: false
    },
    isOut: {
        type: Boolean,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

    }
)

const Run = mongoose.model('Run', runSchema);
export default Run;
