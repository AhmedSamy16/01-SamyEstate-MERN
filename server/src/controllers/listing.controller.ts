import { Request, Response, NextFunction } from "express"
import asyncErrorHandler from "../utils/asyncErrorHandler"
import Listing from "../models/listing.model"
import CustomError from "../utils/CustomError"

export const getListings = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.json("get all listings")
})

export const getListingById = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const listing = await Listing.findById(req.params.id)
    if (!listing) {
        return next(new CustomError("Listing not found", 404))
    }
    res.status(200).json(listing)
})

export const createListing = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const listing = await Listing.create({ ...req.body, userRef: req.user?.id })
    res.status(201).json(listing)
})

export const updateListing = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(listing)
})

export const deleteListing = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    await Listing.findByIdAndDelete(req.params.id)
    res.status(204).json()
})