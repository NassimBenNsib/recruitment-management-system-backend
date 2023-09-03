import { z } from "zod";
import { UserRole } from "../constants/index.js";

const email = z
  .string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  })
  .trim()
  .min(1, "Email should not be empty")
  .email({
    message: "Email is not valid",
  })
  .max(50, "Email too long - should be 50 chars maximum");
const password = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  })
  .trim()
  .min(1, "Password should not be empty")
  .min(6, "Password too short - should be 6 chars minimum")
  .max(30, "Password too long - should be 30 chars maximum")
  .regex(/[a-z]/, {
    message: "Password must have at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    message: "Password must have at least one uppercase letter",
  })
  .regex(/[0-9]/, {
    message: "Password must have at least one number",
  })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Password must have at least one special character",
  });
const oldPassword = z
  .string({
    required_error: "Old Password is required",
    invalid_type_error: "Old Password must be a string",
  })
  .trim()
  .min(1, "Old Password should not be empty")
  .min(6, "Old Password too short - should be 6 chars minimum")
  .max(20, "Old Password too long - should be 20 chars maximum")
  .regex(/[a-z]/, {
    message: "Old Password must have at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    message: "Old Password must have at least one uppercase letter",
  })
  .regex(/[0-9]/, {
    message: "Old Password must have at least one number",
  })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Old Password must have at least one special character",
  });
const newPassword = z
  .string({
    required_error: "New Password is required",
    invalid_type_error: "New Password must be a string",
  })
  .trim()
  .min(1, "New Password should not be empty")
  .min(6, "New Password too short - should be 6 chars minimum")
  .max(20, "New Password too long - should be 20 chars maximum")
  .regex(/[a-z]/, {
    message: "New Password must have at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    message: "New Password must have at least one uppercase letter",
  })
  .regex(/[0-9]/, {
    message: "New Password must have at least one number",
  })
  .regex(/[^a-zA-Z0-9]/, {
    message: "New Password must have at least one special character",
  });
const passwordConfirmation = z
  .string({
    required_error: "Password confirmation is required",
    invalid_type_error: "Password confirmation must be a string",
  })
  .trim()
  .min(1, "Password confirmation should not be empty");
const termsAndConditions = z
  .boolean({
    required_error: "You must accept the terms and conditions",
    invalid_type_error: "You must accept the terms and conditions",
  })
  .refine((data) => data === true, {
    message: "You must accept the terms and conditions",
  });

const userId = z
  .string({
    required_error: "User ID is required",
    invalid_type_error: "User ID must be a string",
  })
  .trim()
  .min(1, "User ID should not be empty")
  .min(6, "User ID should be at least 6 characters long")
  .max(50, "User ID too long - should be 50 chars maximum");

const ticketId = z
  .string({
    required_error: "Ticket ID is required",
    invalid_type_error: "Ticket ID must be a string",
  })
  .trim()
  .min(1, "Ticket ID should not be empty")
  .uuid({
    message: "Ticket ID is not valid",
  })
  .max(50, "Ticket ID too long - should be 50 chars maximum");

const sessionId = z
  .string({
    required_error: "Session ID is required",
    invalid_type_error: "Session ID must be a string",
  })
  .trim()
  .min(1, "Session ID should not be empty")
  .uuid({
    message: "Session ID is not valid",
  });

const resetPasswordCode = z
  .string({
    required_error: "Reset Password Code is required",
    invalid_type_error: "Reset Password Code must be a string",
  })
  .trim()
  .min(1, "Reset Password Code should not be empty")
  .uuid({
    message: "Reset Password Code is not valid",
  })
  .max(50, "Reset Password code too long - should be 50 chars maximum");
const firstName = z
  .string({
    required_error: "First Name is required",
    invalid_type_error: "First Name must be a string",
  })
  .trim()
  .min(1, "First Name should not be empty")
  .min(3, "First Name should be at least 3 characters long")
  .max(18, "First Name should be at most 18 characters long")
  .refine(
    (value) => {
      const words = value.split(" ");
      return words.every((word) => /^[A-Z][a-z]{2,}$/.test(word));
    },
    {
      message:
        "First Name must be composite with at least 3 characters per word, and each word must start with a capital letter.",
    }
  );
const lastName = z
  .string({
    required_error: "Last Name is required",
    invalid_type_error: "Last Name must be a string",
  })
  .trim()
  .min(1, "Last Name should not be empty")
  .min(3, "Last Name should be at least 3 characters long")
  .max(18, "Last Name should be at most 18 characters long")
  .refine(
    (value) => {
      const words = value.split(" ");
      return words.every((word) => /^[A-Z][a-z]{2,}$/.test(word));
    },
    {
      message:
        "Last Name must be composite with at least 3 characters per word, and each word must start with a capital letter.",
    }
  );
const zipPostalCode = z
  .string({
    required_error: "Zip/Postal Code is required",
    invalid_type_error: "Zip/Postal Code must be a string",
  })
  .trim()
  .min(1, "Zip/Postal Code should not be empty")
  .min(3, "Zip/Postal Code should be at least 3 characters long")
  .max(15, "Zip/Postal Code should be at most 15 characters long");
const city = z
  .string({
    required_error: "City is required",
    invalid_type_error: "City must be a string",
  })
  .trim()
  .min(1, "City should not be empty")
  .min(3, "City should be at least 3 characters long")
  .max(15, "City should be at most 15 characters long");
const address = z
  .string({
    required_error: "Address is required",
    invalid_type_error: "Address must be a string",
  })
  .min(1, "Address should not be empty")
  .min(3, "Address should be at least 3 characters long")
  .max(30, "Address should be at most 30 characters long");
const state = z
  .string({
    required_error: "State is required",
    invalid_type_error: "State must be a string",
  })
  .trim()
  .min(1, "State should not be empty")
  .min(3, "State should be at least 3 characters long")
  .max(30, "State should be at most 30 characters long");
const phoneNumber = z
  .string({
    required_error: "Phone Number is required",
    invalid_type_error: "Phone Number must be a string",
  })
  .trim()
  .min(1, "Phone Number should not be empty")
  .min(8, "Phone Number should be at least 8 characters long")
  .max(15, "Phone Number should be at most 15 characters long")
  .regex(/^\+/, {
    message: "Phone Number must start with a +",
  })
  .regex(/^\+?[0-9]{6,}$/, {
    message: "Phone Number must be a number",
  });

const organizationName = z
  .string({
    required_error: "Organization Name is required",
    invalid_type_error: "Organization Name must be a string",
  })
  .trim()
  .min(1, "Organization Name should not be empty")
  .min(3, "Organization Name should be at least 3 characters long")
  .max(30, "Organization Name should be at most 30 characters long");
const department = z
  .string({
    required_error: "Department is required",
    invalid_type_error: "Department must be a string",
  })
  .trim()
  .min(1, "Department should not be empty")
  .min(3, "Department should be at least 3 characters long")
  .max(30, "Department should be at most 30 characters long");
const position = z
  .string({
    required_error: "Position is required",
    invalid_type_error: "Position must be a string",
  })
  .trim()
  .min(1, "Position should not be empty")
  .min(3, "Position should be at least 3 characters long")
  .max(30, "Position should be at most 30 characters long");

const roleOptional = z
  .string({
    required_error: "Role is required",
    invalid_type_error: "Role must be a string",
  })
  .trim()
  .max(100, "Role should be at most 100 characters long")
  .refine(
    (value) => value.length === 0 || Object.values(UserRole).includes(value),
    {
      message: "Role must be a valid role",
    }
  );
const role = z
  .string({
    required_error: "Role is required",
    invalid_type_error: "Role must be a string",
  })
  .trim()
  .min(1, "Role should not be empty")
  .min(3, "Role should be at least 5 characters long")
  .max(100, "Role should be at most 100 characters long")
  .refine((value) => Object.values(UserRole).includes(value), {
    message: "Role must be a valid role",
  });

const birthday = z
  .string({
    required_error: "Birthday is required",
    invalid_type_error: "Birthday must be a string",
  })
  .refine((value) => {
    return !isNaN(Date.parse(value));
  }, "Birthday must be a valid date")
  .refine((value) => {
    return new Date(value) < new Date();
  }, "Birthday should be at most today")
  .refine((value) => {
    return new Date(value) > new Date(1900, 0, 1);
  }, "Birth Date should be at least 1900")
  .refine((value) => {
    return new Date().getFullYear() - new Date(value).getFullYear() >= 18;
  }, "You must be at least 18 years old");

const image = z
  .string({
    required_error: "Image is required",
    invalid_type_error: "Image must be a string",
  })
  .min(1, "Image should not be empty")
  .max(50, "Image should be at most 50 characters long")
  .uuid({
    message: "Image must be a valid uuid",
  });
const images = z.array(image);
const audio = z
  .string({
    required_error: "Audio is required",
    invalid_type_error: "Audio must be a string",
  })
  .min(1, "Audio should not be empty")
  .max(50, "Audio should be at most 50 characters long")
  .uuid({
    message: "Audio must be a valid uuid",
  });
const audios = z.array(audio);
const document = z
  .string({
    required_error: "Document is required",
    invalid_type_error: "Document must be a string",
  })
  .min(1, "Document should not be empty")
  .max(50, "Document should be at most 50 characters long")
  .uuid({
    message: "Document must be a valid uuid",
  });
const documents = z.array(document);
const limit = z
  .number({
    required_error: "Limit is required",
    invalid_type_error: "Limit must be a number",
  })
  .int({
    message: "Limit must be an integer",
  })
  .min(1, {
    message: "Limit must be at least 1",
  })
  .max(51, {
    message: "Limit of Rows must be at most 51",
  });
const start = z
  .number({
    required_error: "Start is required",
    invalid_type_error: "Start must be a number",
  })
  .int({
    message: "Start must be an integer",
  })
  .min(0, {
    message: "Start must be at least 0",
  });

const jobTitle = z
  .string({
    required_error: "Job Title is required",
    invalid_type_error: "Job Title must be a string",
  })
  .trim()
  .min(1, "Job Title should not be empty")
  .min(3, "Job Title should be at least 3 characters long")
  .max(30, "Job Title should be at most 30 characters long");

const order = z
  .number({
    required_error: "Order is required",
    invalid_type_error: "Order must be a number",
  })
  .int({
    message: "Order must be an integer",
  })
  .min(-1, {
    message: "Order must be at least -1",
  })
  .max(1, {
    message: "Order must be at most 1",
  });

const sortBy = (list) => {
  return z
    .string({
      required_error: "Sort By is required",
      invalid_type_error: "Sort By must be a string",
    })
    .refine((value) => {
      return list.includes(value);
    });
};

const SchemaValidationUtils = {
  email,
  password,
  oldPassword,
  newPassword,
  passwordConfirmation,
  termsAndConditions,
  userId,
  resetPasswordCode,
  firstName,
  lastName,
  zipPostalCode,
  city,
  address,
  order,
  sortBy,
  state,
  phoneNumber,
  organizationName,
  department,
  position,
  birthday,
  jobTitle,
  role,
  start,
  limit,
  roleOptional,
};

export { SchemaValidationUtils };
