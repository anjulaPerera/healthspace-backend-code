import { Schema, Types, model, Document } from "mongoose";
var mongoose = require("mongoose");
import DonationData from "../enums/Donation";

const { DonationType, BloodType, UrgencyOfNeed, Condition } = DonationData;

const requestSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
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
    otherDetails: { type: String, required: false },
  },
  equipmentDonationSpecifics: {
    typeOfEquipment: { type: String, required: false },
    condition: { type: String, enum: Condition, required: false },
    otherDetails: { type: String, required: false },
  },
  otherDonationSpecifics: {
    typeOfDonation: { type: String, required: false },
    quantity: { type: Number, required: false },
    urgencyOfNeed: { type: String, enum: UrgencyOfNeed, required: false },
    otherDetails: { type: String, required: false },
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Request = mongoose.model("Request", requestSchema);

export default Request;
