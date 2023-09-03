import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import hpp from "hpp";
import rateLimiter from "express-rate-limit";
import {
  UserRouter,
  CandidateRouter,
  InterviewRouter,
  QuizRouter,
  RecruitmentRouter,
} from "./routes/index.js";

import { APP_CONFIG } from "./../config/index.js";
import { CounterModel } from "./models/counter.model.js";

const application = express();

application.use(cors());
application.use(bodyParser.json({ extended: true, limit: "50mb" }));
application.use(bodyParser.urlencoded({ extended: true }));
application.use(helmet());
application.use(helmet.noSniff());
application.use(helmet.frameguard());
application.use(helmet.xssFilter());
application.use(helmet.hidePoweredBy());
application.use(helmet.ieNoOpen());
application.use(helmet.dnsPrefetchControl());
application.use(helmet.referrerPolicy());
application.use(helmet.hsts());
application.use(helmet.permittedCrossDomainPolicies());
application.use(
  hpp({
    checkBody: true,
    checkQuery: true,
  })
);
application.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes,
    max: 100,
  })
);

application.use("/api/user", UserRouter);
application.use("/api/candidate", CandidateRouter);
application.use("/api/interview", InterviewRouter);
application.use("/api/quiz", QuizRouter);
application.use("/api/recruitment", RecruitmentRouter);

console.clear();
console.log("[SERVER] : MongoDB connecting...");

mongoose
  .connect(APP_CONFIG.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(async () => {
    console.log(
      `[SERVER] : MongoDB connected successfully : ${APP_CONFIG.MONGO_URL}`
    );
    const counter = await CounterModel.findOne();
    if (!counter)
      await CounterModel.create({
        userNumber: 0,
        candidateNumber: 0,
        recruitmentNumber: 0,
        interviewNumber: 0,
        quizNumber: 0,
      });
    console.table({
      userNumber: counter?.userNumber ?? 0,
      candidateNumber: counter?.candidateNumber ?? 0,
      recruitmentNumber: counter?.recruitmentNumber ?? 0,
      interviewNumber: counter?.interviewNumber ?? 0,
      quizNumber: counter?.quizNumber ?? 0,
    });
    console.log("[SERVER] : Application running...");
    console.table(APP_CONFIG);
    application.listen(APP_CONFIG.PORT, () => {
      console.log(
        `[SERVER] : Application running successfully : ${APP_CONFIG.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
