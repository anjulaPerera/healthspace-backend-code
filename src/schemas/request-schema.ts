import { Schema, Types, model, Document } from "mongoose";
var mongoose = require("mongoose");
import DonationData from "../enums/Donation";

const { DonationType, BloodType, UrgencyOfNeed, Condition } = DonationData;

const donationRequestSchema = new mongoose.Schema({
  requestedListing: {
    type: Object,
    required: true,
  },
  requester: {
    type: Object,
    required: true,
  },
  donor:{
    type: Object,
    required: true,
  
  }
});

const DonationRequest = mongoose.model(
  "onnationRequest",
  donationRequestSchema
);

export default DonationRequest;
