import { Schema, Types, model, Document } from "mongoose";
var mongoose = require("mongoose");
import DonationData from "../enums/Donation";

const { DonationType, BloodType, UrgencyOfNeed, Condition } = DonationData;

const donationRequestSchema = new mongoose.Schema({
  donationType: {
    type: String,
    enum: DonationType,
    required: true,
  },
  organDonationSpecifics: {
    organName: { type: String, required: false },
    bloodType: { type: String, enum: BloodType, required: false },
    urgencyOfNeed: { type: String, enum: UrgencyOfNeed, required: false },
    healthCareProviderDetails: { type: String, required: false },
  },
  equipmentDonationSpecifics: {
    typeOfEquipment: { type: String, required: false },
    condition: { type: String, enum: Condition, required: false },
  },
  otherDonationSpecifics: {
    typeOfDonation: { type: String, required: false },
    quantity: { type: Number, required: false },
    urgencyOfNeed: { type: String, enum: UrgencyOfNeed, required: false },
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otherDetails: { type: String, required: false },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
});

const DonationRequest = mongoose.model(
  "onnationRequest",
  donationRequestSchema
);

export default DonationRequest;
