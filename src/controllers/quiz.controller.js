import mongoose from "mongoose";
import {
  CandidateModel,
  RecruitmentModel,
  QuizModel,
  InterviewModel,
} from "../../server/src/models/index.js";

const createOne = async (request, response) => {
  try {
    const interview = await InterviewModel.findOne({
      _id: new mongoose.Types.ObjectId(request.body.interviewId),
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
    const record = await QuizModel.create({
      ...request.body,
      interviewId: new mongoose.Types.ObjectId(request.body.interviewId),
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
      theme = "",
      start = 0,
      limit = 20,
      sortBy = "recruitmentId",
      order = -1,
    } = request.body;
    const filter = {
      theme: { $regex: theme, $options: "i" },
    };
    if (interviewId !== "") filter.interviewId = interviewId;
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

const deleteManyByIds = async (request, response) => {
  try {
    const { ids } = request.body;
    if (ids.length === 0)
      return response.status(400).json({
        type: "error",
        message: "Please select record to delete",
        data: null,
      });
    const objectIdArray = ids.map((id) => new mongoose.Types.ObjectId(id));
    const records = await QuizModel.deleteMany({
      _id: { $in: objectIdArray },
    });
    if (!records || records.deletedCount !== ids.length)
      return response.status(199).json({
        type: "warning",
        message: "Some records not found",
        data: records,
      });
    return response.status(200).json({
      type: "success",
      message: "All selected records deleted successfully",
      data: records,
    });
  } catch (error) {
    return response.status(500).json({
      type: "error",
      message: "Error during deleting records, Please try again later",
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
  deleteManyByIds,
};
