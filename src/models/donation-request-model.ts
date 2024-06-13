import * as mongoose from "mongoose";

interface Common {
  requestedListing: {},
  requester: {},
  donor: {}
}

export interface DRequest extends Common {}
export interface IRequest extends Common, mongoose.Document {}
