import { Request, Response, NextFunction } from "express";
import asyncErrorHandler from "./asyncErrorHandler";
import CustomError from "./CustomError";

const isValidId = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.id !== req.params.id) {
        return next(new CustomError("Unauthorized", 403))
    }
    next()
})

export default isValidId