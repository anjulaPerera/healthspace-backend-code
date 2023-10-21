var mongoose = require('mongoose');
import { Schema } from "mongoose";

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    teamId: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Player = mongoose.model('Player', playerSchema);
export default Player;