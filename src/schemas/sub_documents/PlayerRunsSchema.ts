var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PlayerRuns = new Schema({
    playerId: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: false
    },
    one: {
        type: Number,
        required: false
    },
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
})

export default PlayerRuns;
