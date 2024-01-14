import { Router } from "express";
import { protectRoutes } from "../utils/protectRoutes";
import { deleteUser, getLoggedinUser, getUserById, getUserListings, updateUser } from "../controllers/user.controller";
import isValidId from "../utils/isValidId";

const router = Router()

router.route("/")
    .get(protectRoutes, getLoggedinUser)

router.route("/:id")
    .get(protectRoutes, getUserById)
    .patch(protectRoutes, isValidId, updateUser)
    .delete(protectRoutes, isValidId, deleteUser)

router.route("/listings/:id")
    .get(protectRoutes, getUserListings)


export default router