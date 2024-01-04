import { Router } from "express"
import { signUp, signIn, google, signOut } from "../controllers/auth.controller"

const router = Router()

router.post("/signup", signUp)
router.post("/signin", signIn)
router.post("/signout", signOut)
router.post("/google", google)

export default router