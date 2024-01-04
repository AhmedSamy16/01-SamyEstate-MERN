import { Request, Response, NextFunction } from "express"
import asyncErrorHandler from "./asyncErrorHandler";
import User from "../models/user.model";
import jwt from "jsonwebtoken"
import CustomError from "./CustomError";

export const protectRoutes = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
    // 1. Check if cookie exists
    if (!token) {
        return next(new CustomError("Unauthorized", 401))
    }
    // 2. Validate the token
    const decodedToken = jwt.verify(token, process.env.SECRET_STR as string) as DecodedTokenType;
    if (!decodedToken?.id) {
        return next(new CustomError("Unauthorized", 401))
    }
    // 3. Check is user exists
    const user = await User.findById(decodedToken.id)
    if (!user) {
        return next(new CustomError("User does not exist", 404))
    }
    req.user = user
    next()
})

export const restrictAccess = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user && !allowedRoles.includes(req.user.role)) {
            return next(new CustomError("You do not have permissions to perform this action", 403))
        }
        next()
    }
}