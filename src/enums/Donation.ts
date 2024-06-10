const DonationData = {
  DonationType: {
    ORGAN: "ORGAN",
    EQUIPMENT: "EQUIPMENT",
    OTHER: "OTHER",
  },
  BloodType: {
    A_POSITIVE: "A+",
    A_NEGATIVE: "A-",
    B_POSITIVE: "B+",
    B_NEGATIVE: "B-",
    AB_POSITIVE: "AB+",
    AB_NEGATIVE: "AB-",
    O_POSITIVE: "O+",
    O_NEGATIVE: "O-",
  },
  UrgencyOfNeed: {
    HIGH: "HIGH",
    MEDIUM: "MEDIUM",
    LOW: "LOW",
  },
  Availability: {
    LIVING: "LIVING",
    POSTHUMOUS: "POSTHUMOUS",
  },
  Condition: {
    NEW: "NEW",
    USED: "USED",
    REFURBISHED: "REFURBISHED",
  },
};

export default DonationData;
