require("dotenv").config();
import databaseSetup from "../startup/database";
import seed from "./seed";
const mongoose = require("mongoose");

async function runSeed() {
  await databaseSetup();

  await seed();

  await mongoose.disconnect();
}

runSeed();
