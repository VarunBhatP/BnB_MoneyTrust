import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {JWT_SECRET,JWT_EXPIRE} from '../utils/jwtExport.js'


export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email and password required" });
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Email already registered" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    if (!JWT_SECRET || typeof JWT_SECRET !== "string") {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "JWT secret is not configured on the server" });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res
      .status(StatusCodes.CREATED)
      .json({user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ message: "Invalid credentials" });
    if (!JWT_SECRET || typeof JWT_SECRET !== "string") {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "JWT secret is not configured on the server" });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRE,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
