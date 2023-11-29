/// <reference path="global.d.ts" />
const app = require("express")();
import { NextFunction, Request, Response } from "express";
import passportStartup from "./startup/passport";
import * as routes from "./routes";
import { Authentication } from "./middleware/authentication";
import { ResponseHandler } from "./middleware/response-handler";
import express from "express";
import path from "path";
passportStartup(app);
const cors = require("cors");
require("dotenv").config();

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

app.use(cors());

var port = process.env.PORT || 6000;

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(ResponseHandler);
app.use("/api/auth", Authentication.verifyToken);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


routes.initRoutes(app);

app.use(function (req: Request, res: Response) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

app.listen(port, () => {
  console.log(`API server started on: ${port}`);
});
