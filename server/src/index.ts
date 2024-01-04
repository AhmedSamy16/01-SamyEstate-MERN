import dotenv from "dotenv"
import app from "./app";
import connectDB from "./utils/connectDB";

dotenv.config()


const main = async () => {
    const PORT = process.env.PORT || 5000
    await connectDB()
    app.listen(PORT, () => {
        console.log(`App running on port ${PORT}`)
    })
}

main()