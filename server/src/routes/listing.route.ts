import { Router } from "express";
import { protectRoutes } from "../utils/protectRoutes";
import { createListing, deleteListing, getListingById, getListings, updateListing } from "../controllers/listing.controller";
import isListingExist from "../utils/isListingExist";


const router = Router()

router.route("/")
    .get(getListings)
    .post(protectRoutes, createListing)

router.route("/:id")
    .get(getListingById)
    .patch(protectRoutes, isListingExist, updateListing)
    .delete(protectRoutes, isListingExist, deleteListing)

export default router