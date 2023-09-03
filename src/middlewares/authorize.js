import { APP_CONFIG } from "../../config/index.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../../server/src/models/user.model.js";
export const verifyTokenAndRole = (requiredRoles) => async (req, res, next) => {
  const authHeader = req.headers.token;
  if (!authHeader) {
    return res.status(401).json("Token is not valid!");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, APP_CONFIG.JWT_SECRET);
  req.user = decoded;

  if (!req.user || !req.user.id) {
    return res.status(403).json("Access denied.");
  }

  const user = await UserModel.findById(req.user.id);

  if (!user) {
    return res.status(403).json("User not found.");
  }

  if (requiredRoles.includes(user.role)) {
    next();
  } else {
    res.status(403).json("You are not allowed to perform this action.");
  }
};
