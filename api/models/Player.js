var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const playerSchema = new Schema({
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
module.exports = { Player }