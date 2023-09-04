import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({
  evaluatorId: { required: true, type: String },
  evaluatorNumber: { required: true, type: Number },
  evaluatorName: { required: true, type: String },
  candidateId: { required: true, type: String },
  candidateNumber: { required: true, type: Number },
  candidateName: { required: true, type: String },
  interviewDate: { required: true, type: Date },
  score: { required: true, type: Number },
});

export const InterviewModel = mongoose.model("Interview", InterviewSchema);
