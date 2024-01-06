import { Request, Response, NextFunction } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import User from "../models/user.model";
import CustomError from "../utils/CustomError";
import bcrypt from "bcrypt";
import { signToken } from "../utils/tokenHandler";

export const signUp = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        return res.status(400).json({
            status: 'failed',
            message: 'Please provide required data'
        })
    }
    await User.create({ username, email, password })
    res.status(201).json({
        status: 'success',
        message: "User created successfully"
    })
})


export const signIn = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new CustomError("Please provide required data", 400))
    }
    const validUser = await User.findOne({ email }).select('+password')
    if (!validUser) {
        return next(new CustomError("User does not exist", 404))
    }
    const isRightPassword = await bcrypt.compare(password, validUser.password)
    if (!isRightPassword) {
        return next(new CustomError("Invalid Data", 400))
    }
    const token = signToken(validUser.id)
    validUser.password = ""
    res
    .cookie("accessToken", token, { maxAge: 1000000 })
    .status(200)
    .json({ user: validUser })
})


export const google = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, avatar } = req.body
    if (!email) {
        return next(new CustomError("Please provide required data", 400))
    }
    let user = await User.findOne({ email })
    let token = ""
    if (user) {
        token = signToken(user.id)
    } else {
        const generatedPassword: string = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
        const generatedUsername: string = name.replace(/\s/g, '').toLowerCase() + Math.random().toString(36).slice(-4)
        user = await User.create({ email, username: generatedUsername, password: generatedPassword, avatar })
    }
    user.password = ""
    res
    .cookie("accessToken", token, { maxAge: 1000000 })
    .status(200)
    .json({ user })
})


export const signOut = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken')
    res.status(200).json({
        message: "User has logged out successfully"
    })
})