import mongoose from "mongoose";
import { RecruitmentStatus } from "../constants/index.js";
import { RecruitmentModel } from "../../server/src/models/index.js";

const createOne = async (request, response) => {
  try {
    const exits = await RecruitmentModel.findOne({
      requestNumber: request.body.requestNumber,
    });
    if (exits)
      return response.status(400).json({
        type: "error",
        message: "Request number already exists",
        data: null,
      });
    const record = await RecruitmentModel.create({
      ...request.body,
      status: RecruitmentStatus.Pending,
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

    const record = await RecruitmentModel.findOne({
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
    const record = await RecruitmentModel.findOne({ _id: id });
    if (!record)
      return response.status(404).json({
        type: "error",
        message: "Record not found",
        data: null,
      });
    const newRecord = {
      observation: record.observation,
      experience: record.experience,
      qualification: record.qualification,
      needs: record.needs,
      sourceOfNeeds: record.sourceOfNeeds,
      departmentHead: record.departmentHead,
      education: record.education,
      objective: record.objective,
      department: record.department,
      status: record.status,
      requestNumber: record.requestNumber,
      ...request.body,
    };
    record.observation = newRecord.observation;
    record.experience = newRecord.experience;
    record.qualification = newRecord.qualification;
    record.needs = newRecord.needs;
    record.sourceOfNeeds = newRecord.sourceOfNeeds;
    record.departmentHead = newRecord.departmentHead;
    record.requestNumber = newRecord.requestNumber;
    record.education = newRecord.education;
    record.objective = newRecord.objective;
    record.department = newRecord.department;
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
    const record = await RecruitmentModel.findOneAndDelete({
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
      observation = "",
      experience = "",
      qualification = "",
      needs = "",
      sourceOfNeeds = "",
      departmentHead = "",
      minRequestNumber = 1,
      maxRequestNumber = 200000000,
      education = "",
      objective = "",
      department = "",
      status = "",
      start = 0,
      limit = 20,
      sortBy = "requestNumber",
      order = -1,
    } = request.query;
    const records = await RecruitmentModel.find({
      observation: { $regex: observation, $options: "i" },
      experience: { $regex: experience, $options: "i" },
      qualification: { $regex: qualification, $options: "i" },
      needs: { $regex: needs, $options: "i" },
      requestNumber: {
        $gte: minRequestNumber,
        $lte: maxRequestNumber,
      },
      sourceOfNeeds: { $regex: sourceOfNeeds, $options: "i" },
      departmentHead: { $regex: departmentHead, $options: "i" },
      education: { $regex: education, $options: "i" },
      objective: { $regex: objective, $options: "i" },
      department: { $regex: department, $options: "i" },
      status: { $regex: status, $options: "i" },
    })
      .sort({ [sortBy]: order })
      .limit(limit)
      .skip(start);
    return response.status(200).json({
      type: "success",
      message: "Records found successfully",
      data: records,
    });
  } catch (error) {
    return response.status(500).json({
      type: "error",
      message: "Error while getting records, Please try again later",
      data: error,
    });
  }
};
const updateManyByIds = async (request, response) => {
  try {
    const { ids, data } = request.body;
    if (ids.length === 0)
      return response.status(400).json({
        type: "error",
        message: "Please select recruitment to update",
        data: null,
      });
    const updatedRecords = [];
    for (let i = 0; i < ids.length; i++) {
      const idObject = new mongoose.Types.ObjectId(ids[i]);
      const record = await RecruitmentModel.findOne({ _id: idObject });
      const newRecord = {
        observation: record.observation,
        experience: record.experience,
        qualification: record.qualification,
        needs: record.needs,
        sourceOfNeeds: record.sourceOfNeeds,
        departmentHead: record.departmentHead,
        education: record.education,
        objective: record.objective,
        department: record.department,
        status: record.status,
        ...data,
      };
      record.observation = newRecord.observation;
      record.experience = newRecord.experience;
      record.qualification = newRecord.qualification;
      record.needs = newRecord.needs;
      record.sourceOfNeeds = newRecord.sourceOfNeeds;
      record.departmentHead = newRecord.departmentHead;
      record.education = newRecord.education;
      record.objective = newRecord.objective;
      record.department = newRecord.department;
      record.status = newRecord.status;
      await record.save();
      updatedRecords.push(record);
    }
    return response.status(200).json({
      type: "success",
      message: "All selected records updated successfully",
      data: updatedRecords,
    });
  } catch (error) {
    return response.status(500).json({
      type: "error",
      message: "Error during updating records, Please try again later",
      data: error,
    });
  }
};

const updateMany = async (request, response) => {
  try {
    const { data, filter = {} } = request.body;
    const {
      observation = "",
      experience = "",
      qualification = "",
      needs = "",
      sourceOfNeeds = "",
      departmentHead = "",
      minRequestNumber = 1,
      maxRequestNumber = 200000000,
      education = "",
      objective = "",
      department = "",
      status = "",
    } = filter;
    const records = await RecruitmentModel.find({
      observation: { $regex: observation, $options: "i" },
      experience: { $regex: experience, $options: "i" },
      qualification: { $regex: qualification, $options: "i" },
      needs: { $regex: needs, $options: "i" },
      requestNumber: {
        $gte: minRequestNumber,
        $lte: maxRequestNumber,
      },
      sourceOfNeeds: { $regex: sourceOfNeeds, $options: "i" },
      departmentHead: { $regex: departmentHead, $options: "i" },
      education: { $regex: education, $options: "i" },
      objective: { $regex: objective, $options: "i" },
      department: { $regex: department, $options: "i" },
      status: { $regex: status, $options: "i" },
    });
    if (!records || !records.length)
      return response.status(199).json({
        type: "warning",
        message: "No records found",
        data: null,
      });
    const updatedRecords = [];
    for (let i = 0; i < records.length; i++) {
      const newRecord = {
        observation: records[i].observation,
        experience: records[i].experience,
        qualification: records[i].qualification,
        needs: records[i].needs,
        sourceOfNeeds: records.sourceOfNeeds,
        departmentHead: records[i].departmentHead,
        education: records[i].education,
        objective: records[i].objective,
        department: records[i].department,
        status: records[i].status,
        ...data,
      };
      records[i].observation = newRecord.observation;
      records[i].experience = newRecord.experience;
      records[i].qualification = newRecord.qualification;
      records[i].needs = newRecord.needs;
      records[i].sourceOfNeeds = newRecord.sourceOfNeeds;
      records[i].departmentHead = newRecord.departmentHead;
      records[i].education = newRecord.education;
      records[i].objective = newRecord.objective;
      records[i].department = newRecord.department;
      records[i].status = newRecord.status;
      await records[i].save();
      updatedRecords.push(records[i]);
    }
    return response.status(200).json({
      type: "success",
      message: "All selected records deleted successfully",
      data: updatedRecords,
    });
  } catch (error) {
    return response.status(500).json({
      type: "error",
      message: "Error during deleting records, Please try again later",
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
        message: "Please select recruitment to delete",
        data: null,
      });
    const objectIdArray = ids.map((id) => new mongoose.Types.ObjectId(id));
    const records = await RecruitmentModel.deleteMany({
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

export const RecruitmentController = {
  createOne,
  getOneById,
  updateOneById,
  deleteOneById,
  getMany,
  updateMany,
  updateManyByIds,
  deleteManyByIds,
};
