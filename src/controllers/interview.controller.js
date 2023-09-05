import mongoose from "mongoose";
import {
  CandidateModel,
  InterviewModel,
  QuizModel,
  RecruitmentModel,
  UserModel,
} from "../models/index.js";
import { CounterModel } from "../models/counter.model.js";
import { UserRole, UserStatus } from "../constants/index.js";

const createOne = async (request, response) => {
  try {
    const recruitment = await RecruitmentModel.findOne({
      recruitmentNumber: request.body.recruitmentNumber,
    });
    if (!recruitment)
      return response.status(404).json({
        type: "error",
        message: "Recruitment not found",
        data: null,
      });
    const evaluator = await UserModel.findOne({
      userNumber: request.body.evaluatorNumber,
    });
    if (!evaluator)
      return response.status(404).json({
        type: "error",
        message: "Evaluator not found",
        data: null,
      });
    const candidate = await CandidateModel.findOne({
      candidateNumber: request.body.candidateNumber,
    });
    if (!candidate)
      return response.status(404).json({
        type: "error",
        message: "Candidate not found",
        data: null,
      });
    candidate.numberOfInterviews = candidate.numberOfInterviews + 1;
    await candidate.save();

    const counter = await CounterModel.findOneAndUpdate(
      {},
      { $inc: { interviewNumber: 1 } },
      { new: true }
    );

    const record = await InterviewModel.create({
      score: 0,
      candidateId: candidate._id,
      candidateNumber: candidate.candidateNumber,
      candidateName: candidate.firstName + " " + candidate.lastName,
      evaluatorId: evaluator._id,
      evaluatorNumber: evaluator.userNumber,
      evaluatorName: evaluator.firstName + " " + evaluator.lastName,
      recruitmentId: recruitment._id,
      recruitmentNumber: recruitment.requestNumber,
      interviewNumber: counter.interviewNumber,
      interviewDate: request.body.interviewDate,
    });

    if (!record)
      return response.status(400).json({
        type: "error",
        message: "Error during creating new record, Please try again later",
        data: null,
      });
    return response.status(201).json({
      type: "success",
      message: "Record created successfully",
      data: record,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      type: "error",
      message: "Error during creating new record, Please try again later",
      data: error,
    });
  }
};
const getOneById = async (request, response) => {
  try {
    const { id } = request.params;

    const record = await InterviewModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    console.log(record);
    if (!record)
      return response.status(404).json({
        type: "error",
        message: "Record not found",
        data: null,
      });
    return response.status(200).json({
      type: "success",
      message: "Record found successfully",
      data: record,
    });
  } catch (error) {
    return response.status(500).json({
      type: "error",
      message: "Error during getting record, Please try again later",
      data: error,
    });
  }
};
const updateOneById = async (request, response) => {
  try {
    const { id } = request.params;
    const record = await InterviewModel.findOne({ _id: id });
    if (!record)
      return response.status(404).json({
        type: "error",
        message: "Record not found",
        data: null,
      });
    const quiz = QuizModel.findOne({
      interviewNumber: record.interviewNumber,
    });
    if (quiz.interviewNumber)
      return response.status(400).json({
        type: "error",
        message: "Interview already evaluated",
        data: null,
      });
    if (
      request.body.evaluatorNumber &&
      request.body.evaluatorNumber !== record.evaluatorNumber
    ) {
      const evaluator = await UserModel.findOne({
        userNumber: request.body.evaluatorNumber,
      });
      if (!evaluator)
        return response.status(404).json({
          type: "error",
          message: "Evaluator not found",
          data: null,
        });
      if (evaluator.role !== UserRole.Technical_Evaluator)
        return response.status(400).json({
          type: "error",
          message: "User is not a technical evaluator",
        });
      record.evaluatorId = new mongoose.Types.ObjectId(evaluator._id);
      record.evaluatorName = evaluator.firstName + " " + evaluator.lastName;
      record.evaluatorNumber = evaluator.userNumber;
    }
    const newRecord = {
      interviewDate: record.interviewDate,
      ...request.body,
    };
    record.interviewDate = newRecord.interviewDate;
    await record.save();
    return response.status(200).json({
      type: "success",
      message: "Record updated successfully",
      data: record,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      type: "error",
      message: "Error during updating record, Please try again later",
      data: error,
    });
  }
};
const deleteOneById = async (request, response) => {
  try {
    const { id } = request.params;
    const record = await InterviewModel.findOneAndDelete({
      _id: id,
    });
    if (!record)
      return response.status(404).json({
        type: "error",
        message: "Record not found",
        data: null,
      });
    const candidate = await CandidateModel.findOne({
      _id: new mongoose.Types.ObjectId(record.candidateId),
    });
    if (!candidate)
      return response.status(404).json({
        type: "error",
        message: "Candidate not found",
        data: null,
      });
    candidate.numberOfInterviews = candidate.numberOfInterviews - 1;
    const quiz = await QuizModel.findOneAndDelete({
      interviewNumber: record.interviewNumber,
    });
    if (quiz) {
      const interviews = await InterviewModel.find({
        candidateNumber: candidate.candidateNumber,
      });
      let score = 0,
        evaluatedInterviews = 0;
      for (let i = 0; i < interviews.length; i++) {
        const quiz = await QuizModel.findOne({
          interviewNumber: interviews[i].interviewNumber,
        });
        if (quiz) {
          evaluatedInterviews++;
          score += interviews[i].score;
        }
      }
      if (evaluatedInterviews !== 0)
        candidate.score = score / evaluatedInterviews;
    }
    await candidate.save();
    return response.status(200).json({
      type: "success",
      message: "Record deleted successfully",
      data: record,
    });
  } catch (error) {
    return response.status(500).json({
      type: "error",
      message: "Error during deleting record, Please try again later",
      data: error,
    });
  }
};
const getMany = async (request, response) => {
  try {
    const {
      recruitmentId = "",
      candidateId = "",
      evaluatorId = "",
      minInterviewNumber = 1,
      maxInterviewNumber = 200000000,
      minCandidateNumber = 1,
      maxCandidateNumber = 200000000,
      minEvaluatorNumber = 1,
      maxEvaluatorNumber = 200000000,
      evaluatorName = "",
      candidateName = "",
      minInterviewDate = Date.now() - 31556926000 * 3, // 3 years ago
      maxInterviewDate = Date.now() * 2, // 2 years later
      minScore = 0,
      maxScore = 10000,
      start = 0,
      limit = 200_000_000,
      sortBy = "interviewDate",
      order = 1,
    } = request.query;
    const filter = {
      evaluatorName: { $regex: evaluatorName, $options: "i" },
      candidateName: { $regex: candidateName, $options: "i" },
      interviewDate: {
        $gte: new Date(minInterviewDate),
        $lte: new Date(maxInterviewDate),
      },
      score: {
        $gte: minScore,
        $lte: maxScore,
      },
      interviewNumber: {
        $gte: minInterviewNumber,
        $lte: maxInterviewNumber,
      },
      candidateNumber: {
        $gte: minCandidateNumber,
        $lte: maxCandidateNumber,
      },
      evaluatorNumber: {
        $gte: minEvaluatorNumber,
        $lte: maxEvaluatorNumber,
      },
    };
    if (recruitmentId !== "")
      filter.recruitmentId = new mongoose.Types.ObjectId(recruitmentId);
    if (candidateId !== "")
      filter.candidateId = new mongoose.Types.ObjectId(candidateId);
    if (evaluatorId !== "")
      filter.evaluatorId = new mongoose.Types.ObjectId(evaluatorId);
    const records = await InterviewModel.find(filter)
      .sort({ [sortBy]: order })
      .limit(limit)
      .skip(start);
    return response.status(200).json({
      type: "success",
      message: "Records found successfully",
      data: records,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      type: "error",
      message: "Error while getting records, Please try again later",
      data: error,
    });
  }
};

export const InterviewController = {
  createOne,
  getOneById,
  updateOneById,
  deleteOneById,
  getMany,
};
