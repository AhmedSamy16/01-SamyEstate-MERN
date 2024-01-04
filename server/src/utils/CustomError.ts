class CustomError extends Error {
    public statusCode: number;
    public status: "error" | "failed";
    public isOperational: boolean;
    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
        this.status = statusCode >= 500 ? "error" : "failed"
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}

export default CustomError