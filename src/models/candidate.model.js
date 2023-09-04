import mongoose from "mongoose";
import { CandidateStatus } from "../constants/index.js";

const CandidateSchema = new mongoose.Schema({
  recruitmentId: { required: true, type: String },
  recruitmentNumber: { required: true, type: Number },
  userId: { required: true, type: String },
  userNumber: { required: true, type: Number },
  candidateNumber: { required: true, type: Number },
  firstName: { required: true, type: String },
  lastName: { required: true, type: String },
  address: { required: true, type: String },
  postalCode: { required: true, type: String },
  phoneNumber: { required: true, type: Number },
  email: { required: true, type: String },
  degree: { required: true, type: String },
  score: { required: true, type: Number },
  numberOfInterviews: { required: true, type: Number },
  dateOfBirth: { required: true, type: Date },
  placeOfBirth: { required: true, type: String },
  candidateCv: { required: true, type: String },
  status: {
    type: String,
    enum: [...Object.values(CandidateStatus)],
    require: true,
    trim: true,
  },
});

export const CandidateModel = mongoose.model("Candidate", CandidateSchema);
