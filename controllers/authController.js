import argon2 from "argon2";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { signupSchema, loginSchema } from "../validations/authValidation.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendEmail from "../utils/sendEmail.js";

const signup = async (req, res) => {
  const { error } = signupSchema.validate(req.body);
  if (error) throw new AppError(error.details[0].message, 400);

  const { name, email, password, phone, address } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError("Email already registered", 409);

  const hashedPassword = await argon2.hash(password);

  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  res.status(201).json({ message: "User registered successfully" });
};

const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) throw new AppError(error.details[0].message, 400);

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid email or password", 401);

  const valid = await argon2.verify(user.password, password);
  if (!valid) throw new AppError("Invalid email or password", 401);

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new AppError("Email is required", 400);

  const user = await User.findOne({ email });
  if (!user) throw new AppError("User with this email does not exist", 404);

  const resetToken = jwt.sign(
    { id: user._id },
    process.env.JWT_RESET_SECRET || "your_reset_secret",
    { expiresIn: "15m" }
  );

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = `
    <p>Hello ${user.name},</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>This link will expire in 15 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html,
  });

  res.status(200).json({
    message: "Password reset email sent",
  });
});

export default {
  signup: asyncHandler(signup),
  login: asyncHandler(login),
  forgotPassword: asyncHandler(forgotPassword),
};
