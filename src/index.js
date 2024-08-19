import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
});

connectDB();




/*
import express from "express";

const app = express();

(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("Error",(error) => {
            console.log("Error:", error);
            throw error
        });
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on PORT: ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.error("Error:", error);
        throw err
        
    }
})()

*/