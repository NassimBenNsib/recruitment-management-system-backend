import mongoose from "mongoose";
import { APP_CONFIG } from "../../config/index.js";
import { UserModel } from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserRole, UserStatus } from "../constants/index.js";
import { CounterModel } from "../models/counter.model.js";

// const signIn = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const existingUser = await User.findOne({ email });
//     if (!existingUser) {
//       return response.status(404).json("User was not found");
//     }
//     const isPasswordCorrect = await bcrypt.compare(
//       password,
//       existingUser.password
//     );
//     if (!isPasswordCorrect) {
//       return response.status(400).json({ message: "Invalid credentials" });
//     }
//     const token = jwt.sign(
//       { id: existingUser._id, role: existingUser.role },
//       APP_CONFIG.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );
//     response.status(200).json({ result: existingUser, token });
//   } catch (error) {
//     response.status(500).json(error);
//   }
// };
const login = async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(404).json({
        message: "No account found with this email. Please register first",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return response.status(401).json({
        type: "error",
        message: "Password is incorrect",
        data: null,
      });
    }
    if (user.status === UserStatus.Pending)
      return response.status(401).json({
        type: "error",
        message: "Your account is not approved yet",
        data: null,
      });
    if (user.status === UserStatus.Blocked)
      return response.status(401).json({
        type: "error",
        message: "Your account is blocked",
        data: null,
      });
    if (user.status === UserStatus.Rejected)
      return response.status(401).json({
        type: "error",
        message: "Your account is rejected",
        data: null,
      });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      APP_CONFIG.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return response.status(200).json({
      type: "success",
      message: "User logged in successfully",
      data: { token, user },
    });
  } catch (error) {
    console.error("============ ERROR BEGIN ============");
    console.table(error);
    console.error(error);
    console.error("============= ERROR END =============");
    return response.status(500).json({
      type: "error",
      message: "Error during login, Please try again later",
      data: error,
    });
  }
};
const register = async (request, response) => {
  try {
    const exists = await UserModel.exists({ email: request.body.email });
    if (exists)
      return response.status(400).json({
        type: "error",
        message: "This email already exists",
        data: null,
      });
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(request.body.password, salt);
    const counter = await CounterModel.findOneAndUpdate(
      {},
      { $inc: { userNumber: 1 } },
      { new: true }
    );
    const newUser = new UserModel({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      role: UserRole.Candidate,
      department: request.body.department,
      password: hash,
      status: UserStatus.Pending,
      userNumber: counter.userNumber,
    });
    const user = await UserModel.create(newUser);
    if (!user)
      return response.status(400).json({
        type: "error",
        message: "Error during creating new user, Please try again later",
        data: null,
      });
    return response.status(201).json({
      type: "success",
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("============ ERROR BEGIN ============");
    console.table(error);
    console.error(error);
    console.error("============= ERROR END =============");
    return response.status(500).json({
      type: "error",
      message: "Error during creating new user, Please try again later",
      data: error,
    });
  }
};

const createOne = async (request, response) => {
  try {
    const exists = await UserModel.exists({ email: request.body.email });
    if (exists)
      return response.status(400).json({
        type: "error",
        message: "This email already exists",
        data: null,
      });
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(request.body.password, salt);
    const counter = await CounterModel.findOneAndUpdate(
      {},
      { $inc: { userNumber: 1 } },
      { new: true }
    );
    const newUser = new UserModel({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      role: request.body.role,
      department: request.body.department,
      password: hash,
      status: UserStatus.Approved,
      userNumber: counter.userNumber,
    });
    const user = await UserModel.create(newUser);
    if (!user)
      return response.status(400).json({
        type: "error",
        message: "Error during creating new user, Please try again later",
        data: null,
      });
    return response.status(201).json({
      type: "success",
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("============ ERROR BEGIN ============");
    console.table(error);
    console.error(error);
    console.error("============= ERROR END =============");
    return response.status(500).json({
      type: "error",
      message: "Error during creating new user, Please try again later",
      data: error,
    });
  }
};
const getOneById = async (request, response) => {
  try {
    const { id } = request.params;
    console.log(id);
    const user = await UserModel.findOne({
      _id: id,
    });
    console.log(user);
    if (!user)
      return response.status(404).json({
        type: "error",
        message: "User not found",
        data: null,
      });
    return response.status(200).json({
      type: "success",
      message: "User found successfully",
      data: user,
    });
  } catch (error) {
    console.error("============ ERROR BEGIN ============");
    console.table(error);
    console.error(error);
    console.error("============= ERROR END =============");
    return response.status(500).json({
      type: "error",
      message: "Error during getting user, Please try again later",
      data: error,
    });
  }
};
const updateOneById = async (request, response) => {
  try {
    const { id } = request.params;
    const user = await UserModel.findOne({ _id: id });
    if (!user)
      return response.status(404).json({
        type: "error",
        message: "User not found",
        data: null,
      });
    if (request.body.role && request.body.role !== user.role)
      return response.status(400).json({
        type: "error",
        message: "You can't change user role",
        data: null,
      });
    if (user.email !== request.body.email) {
      const exists = await UserModel.exists({ email: request.body.email });
      if (exists)
        return response.status(400).json({
          type: "error",
          message: "This email already exists",
          data: null,
        });
    }
    const {
      firstName = user.firstName,
      lastName = user.lastName,
      email = user.email,
      department = user.department,
      role = user.role,
      password = user.password,
      status = user.status,
    } = request.body;
    if (password !== user.password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      user.password = hash;
    }
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.department = department;
    user.role = role;
    user.status = status;
    await user.save();
    return response.status(200).json({
      type: "success",
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("============ ERROR BEGIN ============");
    console.table(error);
    console.error(error);
    console.error("============= ERROR END =============");
    return response.status(500).json({
      type: "error",
      message: "Error during updating user, Please try again later",
      data: error,
    });
  }
};
const deleteOneById = async (request, response) => {
  try {
    const { id } = request.params;
    const user = await UserModel.findOneAndDelete({
      _id: id,
    });
    if (!user)
      return response.status(404).json({
        type: "error",
        message: "User not found",
        data: null,
      });
    return response.status(200).json({
      type: "success",
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    console.error("============ ERROR BEGIN ============");
    console.table(error);
    console.error(error);
    console.error("============= ERROR END =============");
    return response.status(500).json({
      type: "error",
      message: "Error during deleting user, Please try again later",
      data: error,
    });
  }
};
const getMany = async (request, response) => {
  try {
    const {
      email = "",
      firstName = "",
      lastName = "",
      role = "",
      department = "",
      status = "",
      minUserNumber = 0,
      maxUserNumber = 999999,
      start = 0,
      limit = 10000,
      sortBy = "email",
      order = 1,
    } = request.query;
    const filter = {
      email: { $regex: email, $options: "i" },
      firstName: { $regex: firstName, $options: "i" },
      lastName: { $regex: lastName, $options: "i" },
      role: { $regex: role, $options: "i" },
      status: { $regex: status, $options: "i" },
      department: { $regex: department, $options: "i" },
      userNumber: { $gte: minUserNumber, $lte: maxUserNumber },
    };
    const totalOfUsers = await UserModel.countDocuments(filter);
    const users = await UserModel.find(filter)
      .sort({ [sortBy]: order })
      .limit(limit)
      .skip(start);
    return response.status(200).json({
      type: "success",
      message: "Users found successfully",
      data: {
        users,
        pagination: {
          start,
          limit,
          currentPage: Math.floor(start / limit) + 1,
          totalOfPages: Math.ceil(totalOfUsers / limit),
          totalOfRows: totalOfUsers,
        },
      },
    });
  } catch (error) {
    console.error("============ ERROR BEGIN ============");
    console.table(error);
    console.error(error);
    console.error("============= ERROR END =============");
    return response.status(500).json({
      type: "error",
      message: "Error while getting users, Please try again later",
      data: error,
    });
  }
};
const deleteManyByIds = async (request, response) => {
  try {
    const { ids } = request.body;
    if (ids.length === 0)
      return response.status(400).json({
        type: "error",
        message: "Please select users to delete",
        data: null,
      });
    const objectIdArray = ids.map((id) => new mongoose.Types.ObjectId(id));
    const users = await UserModel.deleteMany({ _id: { $in: objectIdArray } });
    if (!users || users.deletedCount !== ids.length)
      return response.status(199).json({
        type: "warning",
        message: "Some users not found",
        data: null,
      });
    return response.status(200).json({
      type: "success",
      message: "All selected users deleted successfully",
      data: users,
    });
  } catch (error) {
    console.error("============ ERROR BEGIN ============");
    console.table(error);
    console.error(error);
    console.error("============= ERROR END =============");
    return response.status(500).json({
      type: "error",
      message: "Error during deleting users, Please try again later",
      data: error,
    });
  }
};

export const UserController = {
  register,
  login,
  createOne,
  getOneById,
  updateOneById,
  deleteOneById,
  getMany,
  deleteManyByIds,
};
