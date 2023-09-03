import mongoose from "mongoose";
import {
  CandidateModel,
  InterviewModel,
  QuizModel,
  RecruitmentModel,
  UserModel,
} from "../models/index.js";

const createOne = async (request, response) => {
  try {
    const recruitment = await RecruitmentModel.findOne({
      _id: new mongoose.Types.ObjectId(request.body.recruitmentId),
    });
    if (
      !recruitment ||
      recruitment.requestNumber !== request.body.requestNumber
    )
      return response.status(404).json({
        type: "error",
        message: "Recruitment not found",
        data: null,
      });
    const candidate = await CandidateModel.findOne({
      _id: new mongoose.Types.ObjectId(request.body.candidateId),
      recruitmentId: new mongoose.Types.ObjectId(request.body.recruitmentId),
      requestNumber: request.body.requestNumber,
    });
    if (!candidate)
      return response.status(400).json({
        type: "error",
        message: "Candidate not found",
        data: null,
      });
    candidate.numberOfInterviews = candidate.numberOfInterviews + 1;
    await candidate.save();
    const user = await UserModel.findOne({
      _id: new mongoose.Types.ObjectId(request.body.evaluatorId),
    });
    if (!user)
      return response.status(404).json({
        type: "error",
        message: "Evaluator not found",
        data: null,
      });
    const record = await InterviewModel.create({
      ...request.body,
      recruitmentId: new mongoose.Types.ObjectId(request.body.recruitmentId),
      candidateId: new mongoose.Types.ObjectId(request.body.candidateId),
      evaluatorId: new mongoose.Types.ObjectId(request.body.evaluatorId),
      recruitmentNumber: recruitment.requestNumber,
      evaluatorName: user.firstName + " " + user.lastName,
      candidateName: candidate.firstName + " " + candidate.lastName,
      grantedScore: 0,
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
    const newRecord = {
      evaluatorId: record.evaluatorId,
      grantedScore: record.grantedScore,
      interviewDate: record.interviewDate,
      ...request.body,
      evaluatorName: record.evaluatorName,
    };
    if (newRecord.evaluatorId !== record.evaluatorId) {
      const user = await UserModel.findOne({
        _id: new mongoose.Types.ObjectId(newRecord.evaluatorId),
      });
      if (!user)
        return response.status(404).json({
          type: "error",
          message: "Evaluator not found",
          data: null,
        });
      record.evaluatorId = new mongoose.Types.ObjectId(newRecord.evaluatorId);
      record.evaluatorName = user.firstName + " " + user.lastName;
    }
    record.grantedScore = newRecord.grantedScore;
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
    await QuizModel.findOneAndDelete({
      interviewId: id,
    });
    candidate.numberOfInterviews = candidate.numberOfInterviews - 1;
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
      evaluatorName = "",
      candidateName = "",
      minInterviewDate = Date.now() - 31556926000 * 3, // 3 years ago
      maxInterviewDate = Date.now() * 2, // 2 years later
      minGrantedScore = 0,
      maxGrantedScore = 1000,
      minRequestNumber = 1,
      maxRequestNumber = 200000000,
      start = 0,
      limit = 20,
      sortBy = "interviewDate",
      order = 1,
    } = request.body;
    const filter = {
      evaluatorName: { $regex: evaluatorName, $options: "i" },
      candidateName: { $regex: candidateName, $options: "i" },
      interviewDate: {
        $gte: new Date(minInterviewDate),
        $lte: new Date(maxInterviewDate),
      },
      grantedScore: {
        $gte: minGrantedScore,
        $lte: maxGrantedScore,
      },
      requestNumber: {
        $gte: minRequestNumber,
        $lte: maxRequestNumber,
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

const deleteManyByIds = async (request, response) => {
  try {
    const { ids } = request.body;
    if (ids.length === 0)
      return response.status(400).json({
        type: "error",
        message: "Please select Candidate to delete",
        data: null,
      });
    const objectIdArray = ids.map((id) => new mongoose.Types.ObjectId(id));
    const records = await InterviewModel.deleteMany({
      _id: { $in: objectIdArray },
    });
    for (let i = 0; i < records.length; i++) {
      const candidate = await CandidateModel.findOne({
        _id: new mongoose.Types.ObjectId(records[i].candidateId),
      });
      candidate.numberOfInterviews = candidate.numberOfInterviews - 1;
      await candidate.save();
      await QuizModel.findOneAndDelete({
        interviewId: ids[i]._id,
      });
    }
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

export const InterviewController = {
  createOne,
  getOneById,
  updateOneById,
  deleteOneById,
  getMany,
  deleteManyByIds,
};
