var mongoose = require('mongoose');
import { Schema } from "mongoose";

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    captainId: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: false
    },
    tournamentId: {
        type: Schema.Types.ObjectId,
        ref: 'Tournament',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

teamSchema.set('toJSON', { virtuals: true });

teamSchema.virtual('players', {
    ref: 'Player',
    localField: '_id',
    foreignField: 'teamId',
});

const Team = mongoose.model('Team', teamSchema)
export default Team;