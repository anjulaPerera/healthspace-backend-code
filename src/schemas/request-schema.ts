import { Schema, Types, model, Document } from "mongoose";
var mongoose = require("mongoose");
import DonationData from "../enums/Donation";
import { request } from "http";

const { DonationType, BloodType, UrgencyOfNeed, Condition } = DonationData;

const RequestSchema = new mongoose.Schema({
  requestedListing: {
    type: Object,
    required: true,
  },
  requester: {
    type: Object,
    required: true,
  },
  donor: {
    type: Object,
    required: true,
  },
  requestedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const DonationRequest = mongoose.model("DonationRequest", RequestSchema);

export default DonationRequest;
