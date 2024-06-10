import * as mongoose from "mongoose";

interface Common {
  content: string;
  title: string;
  donationType: string;
  organDonationSpecifics?: {
    organName: string;
    bloodType: string; //enum
    availabilityForDonation: string; //enum
    healthCareProviderDetails: string;
    otherDetails: string;
  };
  equipmentDonationSpecifics?: {
    typeOfEquipment: string; //e.g., ventilators, MRI machines, hospital beds
    condition: string; //enum new, used, refurbished
    modelNumber: string;
    serialNumber: string;
    manufacturer: string;
    usageHistory: string;
    otherDetails: string;
  };
  otherDonationSpecifics?: {
    typeOfDonation: string;
    quantity: number;
    expiryDate: Date;
    condition: string; //enum new, used, refurbished
    otherDetails: string;
  };

  userId: mongoose.Types.ObjectId;
}

export interface DListing extends Common {}
export interface IListing extends Common, mongoose.Document {}
