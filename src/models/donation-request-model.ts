import * as mongoose from "mongoose";

interface Common {
  requestedListing: {},
  requester: {},
  donor: {},
  requestedAt: Date,
}

export interface DDonationRequest extends Common {}
export interface IDonationRequest extends Common, mongoose.Document {}
