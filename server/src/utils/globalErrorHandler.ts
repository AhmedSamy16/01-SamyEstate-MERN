import mongoose from "mongoose";
import CustomError from "./CustomError";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

const devError = (res: Response, err: CustomError) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stackTrace: err.stack,
        error: err
    })
}

const prodError = (res: Response, err: CustomError) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        res.status(500).json({
            status: "error",
            message: 'Someting went wrong! Please Try again later'
        })
    }
}

const castErrorHandler = (err: mongoose.Error.CastError): CustomError => {
    const msg = `Invalid value for ${err.path}: ${err.value}`
    return new CustomError(msg, 400)
}

const duplicateKeyErrorHandler = (errKeys: Record<string, string>): CustomError => {
    const msg = `${Object.keys(errKeys).map(k => `${k} ${errKeys[k]}`)} already exists`
    return new CustomError(msg, 400)
}

const validationErrorHandler = (err: mongoose.Error.ValidationError): CustomError => {
    let msg = Object.values(err.errors).map(val => val.message).join(". ")
    msg = `Invalid input data: ${msg}`
    return new CustomError(msg, 400)
}

const globalErrorHandler: ErrorRequestHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"
    if (process.env.NODE_ENV === "development") {
        devError(res, err)
    } else if (process.env.NODE_ENV === "production") {
        // Mongoose validation Error
        if (err instanceof mongoose.Error.ValidationError) {
            err = validationErrorHandler(err)
        }
        // Invalid id value
        if (err instanceof mongoose.Error.CastError) {
            err = castErrorHandler(err)
        }
        if (err.message.startsWith("E1100")) {
            err = duplicateKeyErrorHandler((err as any).keyValue)
        }

        prodError(res, err)
    }
}

export default globalErrorHandler