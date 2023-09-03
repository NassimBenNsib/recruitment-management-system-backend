import { Router } from "express";
import { RecruitmentController } from "../controllers/index.js";
import { verifyTokenAndRole } from "../middlewares/authorize.js";

const RecruitmentRouter = Router();

RecruitmentRouter.post(
  "/create-one",
  // verifyTokenAndRole(["Department Head"]),
  RecruitmentController.createOne
);
RecruitmentRouter.get("/get-one-by-id/:id", RecruitmentController.getOneById);
RecruitmentRouter.put(
  "/update-one-by-id/:id",
  // verifyTokenAndRole(["Department Head", "Recruitment Manager"]),
  RecruitmentController.updateOneById
);
RecruitmentRouter.delete(
  "/delete-one-by-id/:id",
  // verifyTokenAndRole(["Department Head"]),
  RecruitmentController.deleteOneById
);
RecruitmentRouter.get("/get-many", RecruitmentController.getMany);
RecruitmentRouter.put(
  "/update-many-by-ids",
  // verifyTokenAndRole(["Department Head"]),
  RecruitmentController.updateManyByIds
);
RecruitmentRouter.put(
  "/update-many",
  // verifyTokenAndRole(["Department Head"]),
  RecruitmentController.updateMany
);
RecruitmentRouter.delete(
  "/delete-many-by-ids",
  // verifyTokenAndRole(["Department Head"]),
  RecruitmentController.deleteManyByIds
);

export { RecruitmentRouter };
