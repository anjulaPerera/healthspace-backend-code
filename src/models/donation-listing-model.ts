import * as mongoose from "mongoose";

interface Common {
  donationType: string;
  organDonationSpecifics?: {
    organName: string;
    bloodType: string; //enum
    availabilityForDonation: string; //enum
    healthCareProviderDetails: string;
  };
  equipmentDonationSpecifics?: {
    typeOfEquipment: string; //e.g., ventilators, MRI machines, hospital beds
    condition: string; //enum new, used, refurbished
    modelNumber: string;
    serialNumber: string;
    manufacturer: string;
    usageHistory: string;
  };
  otherDonationSpecifics?: {
    typeOfDonation: string;
    quantity: number;
    expiryDate: Date;
    condition: string; //enum new, used, refurbished
  };

  userId: mongoose.Types.ObjectId;
  otherDetails: string;
}

export interface DListing extends Common {}
export interface IListing extends Common, mongoose.Document {}
