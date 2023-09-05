import { Router } from "express";
import { InterviewController } from "../controllers/index.js";
import { verifyTokenAndRole } from "../middlewares/authorize.js";

const InterviewRouter = Router();

InterviewRouter.post(
  "/create-one",
  verifyTokenAndRole(["HR Manager"]),
  InterviewController.createOne
);
InterviewRouter.get(
  "/get-one-by-id/:id",
  verifyTokenAndRole(["HR Manager"]),
  InterviewController.getOneById
);
InterviewRouter.put(
  "/update-one-by-id/:id",
  verifyTokenAndRole(["HR Manager"]),
  InterviewController.updateOneById
);
InterviewRouter.delete(
  "/delete-one-by-id/:id",
  verifyTokenAndRole(["HR Manager"]),
  InterviewController.deleteOneById
);
InterviewRouter.get(
  "/get-many",
  verifyTokenAndRole(["HR Manager"]),
  InterviewController.getMany
);
InterviewRouter.delete(
  "/delete-many-by-ids",
  verifyTokenAndRole(["HR Manager"]),
  InterviewController.deleteManyByIds
);

export { InterviewRouter };
