var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const tournamentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    numberOfTeams: {
        type: Number,
        required: true
    },
    leagueTotalMatches: {
        type: Number,
        required: true
    },
    oversPerMatch: {
        type: Number,
        required: true
    },
    semiFinalMatches: {
        type: Number,
        required: true
    },
    numberOfTeamMembers: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Tournament = mongoose.model('Tournament', tournamentSchema);
module.exports = { Tournament }