import { Router } from "express";
import { QuizController } from "../controllers/index.js";

const QuizRouter = Router();

QuizRouter.post("/create-one", QuizController.createOne);
QuizRouter.get("/get-one-by-id/:id", QuizController.getOneById);
QuizRouter.put("/update-one-by-id/:id", QuizController.updateOneById);
QuizRouter.delete("/delete-one-by-id/:id", QuizController.deleteOneById);
QuizRouter.get("/get-many", QuizController.getMany);
QuizRouter.delete("/delete-many-by-ids", QuizController.deleteManyByIds);

export { QuizRouter };
