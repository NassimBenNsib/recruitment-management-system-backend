import { Router } from "express";
import { CandidateController } from "../controllers/index.js";
import { verifyTokenAndRole } from "../middlewares/authorize.js";

const CandidateRouter = Router();

CandidateRouter.post(
  "/create-one",
  //verifyTokenAndRole(["HR Manager"]),
  CandidateController.createOne
);
CandidateRouter.get("/get-one-by-id/:id", CandidateController.getOneById);
CandidateRouter.put(
  "/update-one-by-id/:id",
  //verifyTokenAndRole(["HR Manager"]),
  CandidateController.updateOneById
);
CandidateRouter.delete(
  "/delete-one-by-id/:id",
  //verifyTokenAndRole(["HR Manager"]),
  CandidateController.deleteOneById
);
CandidateRouter.get(
  "/get-many",
  //verifyTokenAndRole(["HR Manager"]),
  CandidateController.getMany
);
CandidateRouter.delete(
  "/delete-many-by-ids",
  CandidateController.deleteManyByIds
);

export { CandidateRouter };
