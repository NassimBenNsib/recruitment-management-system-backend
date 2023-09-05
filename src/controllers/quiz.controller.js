import mongoose from "mongoose";
import {
  CandidateModel,
  RecruitmentModel,
  QuizModel,
  InterviewModel,
} from "../models/index.js";

const createOne = async (request, response) => {
  try {
    const interview = await InterviewModel.findOne({
      interviewNumber: request.body.interviewNumber,
    });
    if (!interview)
      return response.status(404).json({
        type: "error",
        message: "Interview not found",
        data: null,
      });
    const existQuiz = await QuizModel.findOne({
      interviewNumber: request.body.interviewNumber,
    });
    if (existQuiz)
      return response.status(400).json({
        type: "error",
        message: "Interview already evaluated",
        data: null,
      });
    if (request.body.quiz.length === 0)
      return response.status(400).json({
        type: "error",
        message: "Please add at least one question",
        data: null,
      });
    interview.score = request.body.score;
    await interview.save();
    let score = 0,
      evaluatedInterviews = 0;
    const interviews = await InterviewModel.find({
      candidateNumber: interview.candidateNumber,
    });
    for (let i = 0; i < interviews.length; i++) {
      const quiz = await QuizModel.findOne({
        interviewNumber: interviews[i].interviewNumber,
      });
      if (quiz) {
        score += interviews[i].score;
        evaluatedInterviews++;
      }
    }
    const candidate = await CandidateModel.findOne({
      candidateNumber: interview.candidateNumber,
    });
    if (!candidate)
      return response.status(404).json({
        type: "error",
        message: "Candidate not found",
        data: null,
      });
    candidate.score =
      evaluatedInterviews !== 0 ? score / evaluatedInterviews : 0;

    await candidate.save();
    const record = await QuizModel.create({
      interviewNumber: request.body.interviewNumber,
      interviewId: interview._id,
      theme: request.body.theme,
      quiz: request.body.quiz,
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

    const record = await QuizModel.findOne({
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
    const record = await QuizModel.findOne({ _id: id });
    if (!record)
      return response.status(404).json({
        type: "error",
        message: "Record not found",
        data: null,
      });

    const interview = await InterviewModel.findOne({
      interviewNumber: record.interviewNumber,
    });
    if (!interview)
      return response.status(404).json({
        type: "error",
        message: "Interview not found",
        data: null,
      });
    if (request.body.quiz.length === 0)
      return response.status(400).json({
        type: "error",
        message: "Please add at least one question",
        data: null,
      });
    if (interview.score !== request.body.score) {
      interview.score = request.body.score;
      await interview.save();
      let score = 0,
        evaluatedInterviews = 0;
      const interviews = await InterviewModel.find({
        candidateNumber: interview.candidateNumber,
      });
      for (let i = 0; i < interviews.length; i++) {
        const quiz = await QuizModel.findOne({
          interviewNumber: interviews[i].interviewNumber,
        });
        if (quiz) {
          score += interviews[i].score;
          evaluatedInterviews++;
        }
      }
      const candidate = await CandidateModel.findOne({
        candidateNumber: interview.candidateNumber,
      });
      if (!candidate)
        return response.status(404).json({
          type: "error",
          message: "Candidate not found",
          data: null,
        });

      candidate.score =
        evaluatedInterviews !== 0 ? score / evaluatedInterviews : 0;
      await candidate.save();
    }
    const newRecord = {
      theme: record.requestNumber,
      quiz: record.quiz,
      ...request.body,
    };
    record.theme = newRecord.theme;
    record.quiz = newRecord.quiz;
    await record.save();

    return response.status(200).json({
      type: "success",
      message: "Record updated successfully",
      data: record,
    });
  } catch (error) {
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
    const record = await QuizModel.findOneAndDelete({
      _id: id,
    });
    if (!record)
      return response.status(404).json({
        type: "error",
        message: "Record not found",
        data: null,
      });
    const interview = await InterviewModel.findOne({
      interviewNumber: record.interviewNumber,
    });
    if (!interview)
      return response.status(404).json({
        type: "error",
        message: "Interview not found",
        data: null,
      });
    interview.score = 0;
    await interview.save();
    let score = 0,
      evaluatedInterviews = 0;
    const interviews = await InterviewModel.find({
      candidateNumber: interview.candidateNumber,
    });
    for (let i = 0; i < interviews.length; i++) {
      const quiz = await QuizModel.findOne({
        interviewNumber: interviews[i].interviewNumber,
      });
      if (quiz) {
        score += interviews[i].score;
        evaluatedInterviews++;
      }
    }
    const candidate = await CandidateModel.findOne({
      candidateNumber: interview.candidateNumber,
    });
    if (!candidate)
      return response.status(404).json({
        type: "error",
        message: "Candidate not found",
        data: null,
      });

    candidate.score =
      evaluatedInterviews !== 0 ? score / evaluatedInterviews : 0;
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
      interviewId = "",
      minInterviewNumber = 1,
      maxInterviewNumber = 20000000,
      theme = "",
      start = 0,
      limit = 20000000,
      sortBy = "quiz",
      order = -1,
    } = request.body;
    const filter = {
      theme: { $regex: theme, $options: "i" },
      interviewNumber: {
        $gte: minInterviewNumber,
        $lte: maxInterviewNumber,
      },
    };
    if (interviewId !== "")
      filter.interviewId = new mongoose.Types.ObjectId(interviewId);
    const records = await QuizModel.find(filter)
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

export const QuizController = {
  createOne,
  getOneById,
  updateOneById,
  deleteOneById,
  getMany,
};
