import mongoose from "mongoose";
import { RecruitmentStatus } from "../constants/index.js";
import { RecruitmentModel } from "../models/index.js";
import { CounterModel } from "../models/counter.model.js";

const createOne = async (request, response) => {
  try {
    const counter = await CounterModel.findOneAndUpdate(
      {},
      { $inc: { recruitmentNumber: 1 } },
      { new: true }
    );
    const record = await RecruitmentModel.create({
      ...request.body,
      status: RecruitmentStatus.Pending,
      recruitmentNumber: counter.recruitmentNumber,
      observation: "",
      opinion: "",
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
      opinion: record.opinion,
      ...request.body,
    };
    record.observation = newRecord.observation;
    record.opinion = newRecord.opinion;
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
      minRecruitmentNumber = 1,
      maxRecruitmentNumber = 200_000_000,
      education = "",
      objective = "",
      department = "",
      opinion = "",
      status = "",
      start = 0,
      limit = 100_000,
      sortBy = "recruitmentNumber",
      order = -1,
    } = request.query;
    const records = await RecruitmentModel.find({
      observation: { $regex: observation, $options: "i" },
      experience: { $regex: experience, $options: "i" },
      qualification: { $regex: qualification, $options: "i" },
      opinion: { $regex: opinion, $options: "i" },
      needs: { $regex: needs, $options: "i" },
      recruitmentNumber: {
        $gte: minRecruitmentNumber,
        $lte: maxRecruitmentNumber,
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
        opinion: record.opinion,
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
      record.opinion = newRecord.opinion;
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
      opinion = "",
      minRecruitmentNumber = 1,
      maxRecruitmentNumber = 200_000_000,
      education = "",
      objective = "",
      department = "",
      status = "",
    } = filter;
    const records = await RecruitmentModel.find({
      observation: { $regex: observation, $options: "i" },
      experience: { $regex: experience, $options: "i" },
      qualification: { $regex: qualification, $options: "i" },
      opinion: { $regex: opinion, $options: "i" },
      needs: { $regex: needs, $options: "i" },
      recruitmentNumber: {
        $gte: minRecruitmentNumber,
        $lte: maxRecruitmentNumber,
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
        opinion: records[i].opinion,
        department: records[i].department,
        status: records[i].status,
        ...data,
      };
      records[i].opinion = newRecord.opinion;
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
