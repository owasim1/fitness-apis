import { Request, Response } from "express";
import models from "../models";
const db: any = models;

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await db.User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: err || "Some error occurred while creating the User.",
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: err || "Some error occurred while retrieving users.",
    });
  }
};
