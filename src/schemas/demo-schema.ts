import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import { IDemo } from "../models/demo-model";
const schemaOptions: mongoose.SchemaOptions = {
  _id: true,
  id: false,
  timestamps: true,
  skipVersioning: true,
  strict: false,
  toJSON: {
    getters: true,
    virtuals: true,
  },
};

export const demoSchema = new mongoose.Schema(
  {
    email: {
      type: Schema.Types.String,
      required: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    message: {
      type: Schema.Types.String,
      required: true,
    },
    demoStatus: {
      type: Schema.Types.String,
      required: true,
    },
  },
  schemaOptions
);

const Demo = mongoose.model<IDemo>("Demo", demoSchema);
export default Demo;
