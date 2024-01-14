import { Request, Response, NextFunction } from "express"
import User from "../models/user.model"
import asyncErrorHandler from "../utils/asyncErrorHandler"
import CustomError from "../utils/CustomError"
import Listing from "../models/listing.model"

export const getUserById = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new CustomError("User not found", 404))
    }
    user.password = ""
    res.status(200).json({ user })
})

export const updateUser = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    delete req.body.password
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json({ user: updatedUser })
})

export const deleteUser = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndDelete(req.params.id)
    res.clearCookie("accessToken")
    res.sendStatus(204)
})

export const getUserListings = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const listings = await Listing.find({ userRef: req.params.id }).sort("-createdAt")
    res.status(200).json({ listings })
})

export const getLoggedinUser = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    (req.user as IUser).password = ""
    res.status(200).json({ user: req.user })
})