import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import globalErrorHandler from "./utils/globalErrorHandler"
import authRoutes from "./routes/auth.route"
import listingRoutes from "./routes/listing.route"
import userRoutes from "./routes/user.route"
import CustomError from "./utils/CustomError"

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/listing", listingRoutes)
app.use("/api/v1/user", userRoutes)


app.use("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new CustomError(`Can't find ${req.originalUrl} on server`, 404)
    next(err)
})

app.use(globalErrorHandler)

export default app