import * as mongoose from "mongoose";
import { Types } from "mongoose";
import { Type } from "typescript";

interface Common {
  ballNumber: number;
  over: number;
  batsmanId?: Types.ObjectId;
  bowlerId?: Types.ObjectId;
  runs?: number;
  boundary?: boolean;
  status?: string;
}

export interface DPlayerBowls extends Common {}

export interface IPlayerBowls extends Common, mongoose.Document {}
