import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  userNumber: { required: true, type: Number },
  candidateNumber: { required: true, type: Number },
  recruitmentNumber: { required: true, type: Number },
  interviewNumber: { required: true, type: Number },
  quizNumber: { required: true, type: Number },
});

export const CounterModel = mongoose.model("Counter", CounterSchema);
