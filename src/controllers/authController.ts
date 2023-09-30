import { Request, Response } from "express";
import bcrypt from "bcrypt";
import models from "../models/index.js";

const db: any = models;
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Both email and password are required",
      });
    }

    // Check if user exists with given email or username
    const existingUser = await db.User.findOne({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: existingUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const register = async (req: Request, res: Response) => {
  const { password, email, firstName, lastName } = req.body;

  if (!password || !email || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await db.User.findOne({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = await db.User.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
