import mongoose from "mongoose";
import { AnswerEvaluation } from "../constants/index.js";

const QuestionSchema = new mongoose.Schema({
  question: {
    required: true,
    type: String,
    trim: true,
  },
  answer: {
    required: true,
    type: String,
    enum: [...Object.values(AnswerEvaluation)],
  },
});
const QuizSchema = new mongoose.Schema({
  interviewNumber: { required: true, type: Number, trim: true },
  interviewId: { required: true, type: String, trim: true },
  theme: { required: true, type: String, trim: true },
  quiz: { required: true, type: [QuestionSchema], trim: true },
});

export const QuizModel = mongoose.model("Quiz", QuizSchema);
