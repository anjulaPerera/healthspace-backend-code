var mongoose = require("mongoose");
var Schema = mongoose.Schema;
import RunStatus from "../../enums/RunStatus";

const PlayerBowls = new mongoose.Schema({
  ballNumber: {
    type: Number,
    required: false,
  },
  over: {
    type: Number,
    required: false,
  },
  batsmanId: {
    type: Schema.Types.ObjectId,
    ref: "Player",
    required: false,
  },
  bowlerId: {
    type: Schema.Types.ObjectId,
    ref: "Player",
    required: false,
  },
  runs: {
    type: Number,
    required: false,
  },
  boundary: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: RunStatus,
    default: RunStatus.RUNS,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default PlayerBowls;
