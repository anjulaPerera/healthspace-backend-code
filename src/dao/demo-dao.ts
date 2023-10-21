import { Types } from "mongoose";
import { ApplicationError } from "../common/application-error";
import User from "../schemas/user-schema";
import { DDemo, IDemo } from "../models/demo-model";
import Demo from "../schemas/demo-schema";
import DemoStatus from "../enums/DemoStatus";

export namespace DemoDao {
  export async function registerForDemo(data: DDemo): Promise<IDemo> {
    const add = new Demo(data);
    let demo = await add.save();
    return demo;
  }

  export async function doesEmailExists(email: string) {
    const emailFound = await Demo.findOne({ email: email });
    return emailFound;
  }

  export async function getDemoMails(limit: number, offset: number) {
    const emailFound = await Demo.find()
      .skip(limit * (offset - 1))
      .limit(limit);
    return emailFound;
  }

  export async function rejectDemoEmail(
    demoId: Types.ObjectId
  ): Promise<IDemo> {
    let updateDemo: IDemo = await Demo.findOneAndUpdate(
      { _id: demoId },
      {
        $set: {
          demoStatus: DemoStatus.REJECTED,
        },
      },
      { new: true }
    );

    return updateDemo;
  }

  export async function updateDemoStatus(demoEmail: string): Promise<IDemo> {
    let updateDemo: IDemo = await Demo.findOneAndUpdate(
      { email: demoEmail },
      {
        $set: {
          demoStatus: DemoStatus.APPROVED,
        },
      },
      { new: true }
    );

    return updateDemo;
  }
}
