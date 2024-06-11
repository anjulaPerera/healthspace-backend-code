import * as mongoose from "mongoose";

interface Common {

  donationType: string;
  organDonationSpecifics?: {
    organName: string;
    bloodType: string; //enum
    urgencyOfNeed: string; //enum
    healthCareProviderDetails: string;
    otherDetails: string;
  };
  equipmentDonationSpecifics?: {
    typeOfEquipment: string; //e.g., ventilators, MRI machines, hospital beds
    condition: string; //enum new, used, refurbished
    otherDetails: string;
  };
  otherDonationSpecifics?: {
    typeOfDonation: string;
    quantity: number;
    urgencyOfNeed: string; //enum
    otherDetails: string;
  };

  userId: mongoose.Types.ObjectId;
}

export interface DListing extends Common {}
export interface IListing extends Common, mongoose.Document {}
