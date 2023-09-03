import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({
  requestNumber: { require: true, type: Number },
  recruitmentId: { required: true, type: String },
  evaluatorId: { required: true, type: String },
  candidateId: { required: true, type: String },
  evaluatorName: { required: true, type: String },
  candidateName: { required: true, type: String },
  interviewDate: { required: true, type: Date },
  grantedScore: { required: true, type: Number },
});

export const InterviewModel = mongoose.model("Interview", InterviewSchema);
