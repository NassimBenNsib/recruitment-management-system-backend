import mongoose from "mongoose";
import { CandidateModel, RecruitmentModel } from "../models/index.js";

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
      recruitmentId: new mongoose.Types.ObjectId(request.body.recruitmentId),
      requestNumber: request.body.requestNumber,
      email: request.body.email,
    });
    if (candidate)
      return response.status(400).json({
        type: "error",
        message: "Candidate with this email already exists",
        data: null,
      });
    const record = await CandidateModel.create({
      ...request.body,
      recruitmentId: new mongoose.Types.ObjectId(request.body.recruitmentId),
      recruitmentNumber: recruitment.requestNumber,
      numberOfInterviews: 0,
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
    const record = await CandidateModel.findOne({
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
    const record = await CandidateModel.findOne({ _id: id });
    if (!record)
      return response.status(404).json({
        type: "error",
        message: "Record not found",
        data: null,
      });
    const newRecord = {
      requestNumber: record.requestNumber,
      recruitmentId: record.recruitmentId,
      firstName: record.firstName,
      lastName: record.lastName,
      address: record.address,
      postalCode: record.postalCode,
      phoneNumber: record.phoneNumber,
      email: record.email,
      degree: record.degree,
      dateOfBirth: record.dateOfBirth,
      placeOfBirth: record.placeOfBirth,
      candidateCv: record.candidateCv,
      status: record.status,
      ...request.body,
    };
    if (newRecord.recruitmentId !== record.recruitmentId) {
      const recruitment = await RecruitmentModel.findOne({
        _id: new mongoose.Types.ObjectId(newRecord.recruitmentId),
      });
      if (!recruitment || recruitment.requestNumber !== newRecord.requestNumber)
        return response.status(404).json({
          type: "error",
          message: "Recruitment not found",
          data: null,
        });
      record.recruitmentId = new mongoose.Types.ObjectId(
        newRecord.recruitmentId
      );
      record.recruitmentNumber = recruitment.requestNumber;
    }
    if (newRecord.email !== record.email) {
      const candidate = await CandidateModel.findOne({
        recruitmentId: new mongoose.Types.ObjectId(newRecord.recruitmentId),
        requestNumber: newRecord.requestNumber,
        email: newRecord.email,
      });
      if (candidate)
        return response.status(400).json({
          type: "error",
          message: "Candidate with this email already exists",
          data: null,
        });
    }
    record.requestNumber = newRecord.requestNumber;
    record.firstName = newRecord.firstName;
    record.lastName = newRecord.lastName;
    record.address = newRecord.address;
    record.postalCode = newRecord.postalCode;
    record.phoneNumber = newRecord.phoneNumber;
    record.email = newRecord.email;
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
      firstName = "",
      lastName = "",
      address = "",
      postalCode = "",
      email = "",
      degree = "",
      placeOfBirth = "",
      status = "",
      minRequestNumber = 1,
      maxRequestNumber = 200000000,
      start = 0,
      limit = 20,
      sortBy = "recruitmentId",
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
      requestNumber: {
        $gte: minRequestNumber,
        $lte: maxRequestNumber,
      },
    };
    if (recruitmentId)
      filter.recruitmentId = new mongoose.Types.ObjectId(recruitmentId);
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
