import mongoose from "mongoose";
import {
  CandidateModel,
  InterviewModel,
  RecruitmentModel,
  UserModel,
  QuizModel,
} from "../models/index.js";
import {
  CandidateStatus,
  RecruitmentStatus,
  UserRole,
  UserStatus,
} from "../constants/index.js";
import { CounterModel } from "../models/counter.model.js";

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
    if (recruitment.status === RecruitmentStatus.Pending)
      return response.status(404).json({
        type: "error",
        message: "Recruitment is not approved yet",
        data: null,
      });
    if (recruitment.status === RecruitmentStatus.Rejected)
      return response.status(404).json({
        type: "error",
        message: "Recruitment is rejected",
        data: null,
      });
    if (recruitment.status === RecruitmentStatus.Closed)
      return response.status(404).json({
        type: "error",
        message: "Recruitment is closed",
        data: null,
      });
    const user = await UserModel.findOne({
      userNumber: request.body.userNumber,
    });
    if (!user)
      return response.status(404).json({
        type: "error",
        message: "User not found",
        data: null,
      });
    if (user.role !== UserRole.Candidate)
      return response.status(404).json({
        type: "error",
        message: "User is not a candidate",
        data: null,
      });
    if (user.status === UserStatus.Pending)
      return response.status(404).json({
        type: "error",
        message: "User is not approved yet",
        data: null,
      });
    if (user.status === UserStatus.Rejected)
      return response.status(404).json({
        type: "error",
        message: "User is rejected",
        data: null,
      });
    if (user.status === UserStatus.Blocked)
      return response.status(404).json({
        type: "error",
        message: "User is blocked",
        data: null,
      });
    const candidate = await CandidateModel.findOne({
      recruitmentNumber: request.body.recruitmentNumber,
      userNumber: request.body.userNumber,
    });
    if (candidate)
      return response.status(400).json({
        type: "error",
        message: "This candidate already posted for this recruitment",
        data: null,
      });
    const counter = await CounterModel.findOneAndUpdate(
      {},
      { $inc: { candidateNumber: 1 } },
      { new: true }
    );
    const record = await CandidateModel.create({
      ...request.body,
      recruitmentId: recruitment._id,
      recruitmentNumber: recruitment.recruitmentNumber,
      userId: user._id,
      userNumber: user.userNumber,
      candidateNumber: counter.candidateNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      score: 0,
      status: CandidateStatus.Pending,
      numberOfInterviews: 0,
    });
    if (!record)
      return response.status(400).json({
        type: "error",
        message: "Error during creating ne record, Please try again later",
        data: null,
      });
    return response.status(201).json({
      type: "success",
      message: "Record created successfully",
      data: record,
    });
  } catch (error) {
    console.error("============ ERROR BEGIN ============");
    console.table(error);
    console.error(error);
    console.error("============= ERROR END =============");
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
    const record = await CandidateModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
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
    const record = await CandidateModel.findOne({ _id: id });
    if (!record)
      return response.status(404).json({
        type: "error",
        message: "Record not found",
        data: null,
      });
    const newRecord = {
      address: record.address,
      postalCode: record.postalCode,
      phoneNumber: record.phoneNumber,
      degree: record.degree,
      dateOfBirth: record.dateOfBirth,
      placeOfBirth: record.placeOfBirth,
      candidateCv: record.candidateCv,
      status: record.status,
      ...request.body,
    };
    record.address = newRecord.address;
    record.postalCode = newRecord.postalCode;
    record.phoneNumber = newRecord.phoneNumber;
    record.degree = newRecord.degree;
    record.dateOfBirth = newRecord.dateOfBirth;
    record.placeOfBirth = newRecord.placeOfBirth;
    record.candidateCv = newRecord.candidateCv;
    record.status = newRecord.status;
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
    const record = await CandidateModel.findOneAndDelete({
      _id: id,
    });
    if (!record)
      return response.status(404).json({
        type: "error",
        message: "Record not found",
        data: null,
      });
    InterviewModel.deleteMany({ candidateNumber: record.candidateNumber });
    QuizModel.deleteMany({ candidateNumber: record.candidateNumber });
    return response.status(200).json({
      type: "success",
      message: "Record deleted successfully",
      data: record,
    });
  } catch (error) {
    console.log("============ ERROR BEGIN ============");
    console.table(error);
    console.log(error);
    console.log("============= ERROR END =============");
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
      firstName = "",
      lastName = "",
      address = "",
      postalCode = "",
      email = "",
      degree = "",
      placeOfBirth = "",
      status = "",
      recruitmentId = "",
      userId = "",
      minRecruitmentNumber = 0,
      maxRecruitmentNumber = 200_000,
      minUserNumber = 0,
      maxUserNumber = 200_000,
      minCandidateNumber = 0,
      maxCandidateNumber = 200_000,
      start = 0,
      limit = 200_000,
      sortBy = "candidateNumber",
      order = -1,
    } = request.body;
    const filter = {
      firstName: { $regex: firstName, $options: "i" },
      lastName: { $regex: lastName, $options: "i" },
      address: { $regex: address, $options: "i" },
      postalCode: { $regex: postalCode, $options: "i" },
      email: { $regex: email, $options: "i" },
      degree: { $regex: degree, $options: "i" },
      placeOfBirth: { $regex: placeOfBirth, $options: "i" },
      status: { $regex: status, $options: "i" },
      recruitmentNumber: {
        $gte: minRecruitmentNumber,
        $lte: maxRecruitmentNumber,
      },
      userNumber: { $gte: minUserNumber, $lte: maxUserNumber },
      candidateNumber: { $gte: minCandidateNumber, $lte: maxCandidateNumber },
    };
    if (recruitmentId)
      filter.recruitmentId = new mongoose.Types.ObjectId(recruitmentId);
    if (userId) filter.userId = new mongoose.Types.ObjectId(userId);
    const records = await CandidateModel.find(filter)
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
    const records = await CandidateModel.deleteMany({
      _id: { $in: objectIdArray },
    });
    QuizModel.deleteMany({ candidateId: { $in: objectIdArray } });
    InterviewModel.deleteMany({ candidateId: { $in: objectIdArray } });
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

export const CandidateController = {
  createOne,
  getOneById,
  updateOneById,
  deleteOneById,
  getMany,
  deleteManyByIds,
};
