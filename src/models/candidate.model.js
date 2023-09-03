import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema({
  requestNumber: { required: true, type: Number, unique: false },
  recruitmentId: {
    required: true,
    type: String,
  },
  firstName: { required: true, type: String },
  lastName: { required: true, type: String },
  address: { required: true, type: String },
  postalCode: { required: true, type: String },
  phoneNumber: { required: true, type: Number },
  email: { required: true, type: String },
  degree: { required: true, type: String },
  numberOfInterviews: { required: true, type: Number },
  dateOfBirth: { required: true, type: Date },
  placeOfBirth: { required: true, type: String },
  candidateCv: { required: true, type: String },
  status: { required: true, type: String },
});

export const CandidateModel = mongoose.model("Candidate", CandidateSchema);
