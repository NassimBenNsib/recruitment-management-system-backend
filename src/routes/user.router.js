import { Router } from "express";
import { UserController } from "../controllers/index.js";
import { verifyTokenAndRole } from "../middlewares/authorize.js";
import { UserRole } from "../constants/index.js";
const UserRouter = Router();

UserRouter.post("/login", UserController.login);
UserRouter.post("/register", UserController.register);
UserRouter.post(
  "/create-one",
  // verifyTokenAndRole([UserRole.Administrator]),
  UserController.createOne
);
UserRouter.get(
  "/get-one-by-id/:id",
  // verifyTokenAndRole([UserRole.Administrator]),
  UserController.getOneById
);
UserRouter.put(
  "/update-one-by-id/:id",
  // verifyTokenAndRole([UserRole.Administrator]),
  UserController.updateOneById
);
UserRouter.delete(
  "/delete-one-by-id/:id",
  // verifyTokenAndRole([UserRole.Administrator]),
  UserController.deleteOneById
);
UserRouter.get(
  "/get-many",
  // verifyTokenAndRole([UserRole.Administrator]),
  UserController.getMany
);
UserRouter.delete(
  "/delete-many-by-ids",
  // verifyTokenAndRole([UserRole.Administrator]),
  UserController.deleteManyByIds
);

export { UserRouter };
