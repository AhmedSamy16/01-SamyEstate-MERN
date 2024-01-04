import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string)
        console.log("DB Connected Successfully...")
    } catch (error) {
        console.log("DB Failed to connect")
        console.error(error)
    }
}

export default connectDB