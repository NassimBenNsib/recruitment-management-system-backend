import { z } from "zod";
import { SchemaValidationUtils } from "../utils/index.js";

const register = z.object({
  body: z.object({
    email: SchemaValidationUtils.email,
    password: SchemaValidationUtils.password,
    firstName: SchemaValidationUtils.firstName,
    lastName: SchemaValidationUtils.lastName,
    department: SchemaValidationUtils.department,
    jobTitle: SchemaValidationUtils.jobTitle,
  }),
});

const createOne = z.object({
  body: z.object({
    email: SchemaValidationUtils.email,
    password: SchemaValidationUtils.password,
    firstName: SchemaValidationUtils.firstName,
    lastName: SchemaValidationUtils.lastName,
    department: SchemaValidationUtils.department,
    jobTitle: SchemaValidationUtils.jobTitle,
    role: SchemaValidationUtils.role,
  }),
});

const getMany = z.object({
  body: z.object({
    email: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    department: z.string().optional(),
    jobTitle: z.string().optional(),
    limit: SchemaValidationUtils.limit.optional(),
    start: SchemaValidationUtils.start.optional(),
    role: SchemaValidationUtils.roleOptional.optional(),
    order: SchemaValidationUtils.order.optional(),
    sortBy: SchemaValidationUtils.sortBy([
      "email",
      "firstName",
      "lastName",
      "department",
      "jobTitle",
      "role",
    ]).optional(),
  }),
});

const deleteOneById = z.object({
  params: z.object({
    id: SchemaValidationUtils.userId,
  }),
});

const updateOneById = z.object({
  params: z.object({
    id: SchemaValidationUtils.userId,
  }),
  body: z.object({
    email: SchemaValidationUtils.email.optional(),
    password: SchemaValidationUtils.password.optional(),
    firstName: SchemaValidationUtils.firstName.optional(),
    lastName: SchemaValidationUtils.lastName.optional(),
    department: SchemaValidationUtils.department.optional(),
    jobTitle: SchemaValidationUtils.jobTitle.optional(),
    role: SchemaValidationUtils.role.optional(),
  }),
});

const deleteManyByIds = z.object({
  body: z.object({
    ids: z.array(SchemaValidationUtils.userId).optional(),
  }),
});

export const UserValidator = {
  register,
  getMany,
  createOne,
  deleteOneById,
  updateOneById,
  deleteManyByIds,
};
