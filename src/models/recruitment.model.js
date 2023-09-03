import mongoose from "mongoose";
import { RecruitmentStatus } from "../../../src/constants/index.js";

const RecruitmentSchema = new mongoose.Schema({
  observation: { required: true, type: String, trim: true },
  experience: { required: true, type: String, trim: true },
  qualification: { required: true, type: String, trim: true },
  needs: { required: true, type: String, trim: true },
  sourceOfNeeds: { required: true, type: String, trim: true },
  departmentHead: { required: true, type: String, trim: true },
  requestNumber: { required: true, type: Number, unique: true },
  education: { required: true, type: String, trim: true },
  objective: { required: true, type: String, trim: true },
  department: { required: true, type: String, trim: true },
  status: {
    type: String,
    required: true,
    trim: true,
    enum: [...Object.values(RecruitmentStatus)],
  },
});

export const RecruitmentModel = mongoose.model(
  "Recruitment",
  RecruitmentSchema
);
