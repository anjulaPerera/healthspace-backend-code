import * as mongoose from "mongoose";
import { Types } from "mongoose";

interface Common {
  email: string;
  name: string;
  message: string;
  demoStatus: string;
}

export interface DDemo extends Common {}

export interface IDemo extends Common, mongoose.Document {}
