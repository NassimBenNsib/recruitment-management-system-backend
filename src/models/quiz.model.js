import mongoose from "mongoose";
import { AnswerEvaluation } from "../../../src/constants/index.js";

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
  interviewId: { required: true, type: String, trim: true, unique: true },
  theme: { required: true, type: String, trim: true },
  quiz: { required: true, type: [QuestionSchema], trim: true },
});

export const QuizModel = mongoose.model("Quiz", QuizSchema);
