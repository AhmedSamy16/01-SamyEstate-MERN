import { Request, Response, NextFunction } from "express"
import Listing from "../models/listing.model"
import asyncErrorHandler from "./asyncErrorHandler"
import CustomError from "./CustomError"

const isListingExist = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const listing = await Listing.findOne({
        _id: req.params.id,
        userRef: req.user?.id
    })
    if (!listing) {
        return next(new CustomError("Listing not found", 404))
    }
    next()
})

export default isListingExist