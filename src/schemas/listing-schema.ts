import { Schema, Types, model, Document } from "mongoose";
var mongoose = require("mongoose");
import DonationData from './../enums/Donation';

const {DonationType, BloodType,UrgencyOfNeed, Availability, Condition} = DonationData

const listingSchema = new mongoose.Schema({
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
    availabilityForDonation: {
      type: String,
      enum: Availability,
      required: false,
    },
    healthCareProviderDetails: { type: String, required: false },
    otherDetails: { type: String, required: false },
  },
  equipmentDonationSpecifics: {
    typeOfEquipment: { type: String, required: false },
    condition: {
      type: String,
      enum: Condition,
      required: false,
    },
    modelNumber: { type: String, required: false },
    serialNumber: { type: String, required: false },
    manufacturer: { type: String, required: false },
    usageHistory: { type: String, required: false },
    otherDetails: { type: String, required: false },
  },
  otherDonationSpecifics: {
    typeOfDonation: { type: String, required: false },
    quantity: { type: Number, required: false },
    expiryDate: { type: Date, required: false },
    condition: {
      type: String,
      enum: Condition,
      required: false,
    },
    otherDetails: { type: String, required: false },
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
