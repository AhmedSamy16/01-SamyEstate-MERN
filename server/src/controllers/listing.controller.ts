import { Request, Response, NextFunction } from "express"
import asyncErrorHandler from "../utils/asyncErrorHandler"
import Listing from "../models/listing.model"
import CustomError from "../utils/CustomError"
import { SortOrder } from "mongoose"

export const getListings = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.query.limit as string) || 6
    const skip = parseInt(req.query.skip as string) || 0
    const sort = req.query.sort as string || "-createdAt"
    const order = req.query.order as SortOrder || "desc"
    let query = {
        offer: !req.query.offer || req.query.offer === "false" ? { $in: [false, true] } : true,
        furnished: !req.query.furnished || req.query.furnished === "false" ? { $in: [false, true] } : true,
        parking: !req.query.parking || req.query.parking === "false" ? { $in: [false, true] } : true,
        type: !req.query.type || req.query.type === "all" ? { $in: ["sale", "rent"] } : req.query.type,
        name: { $regex: req.query.searchTerm || "", $options: "i" } 
    }
    const listings = await Listing.find(query).sort({ [sort]: order }).limit(limit).skip(skip)
    res.status(200).json(listings)
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
    res.sendStatus(204)
})