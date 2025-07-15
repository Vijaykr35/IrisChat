import mongoose from "mongoose";

export async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGOURI).then( console.log("database connected"));


    }
    catch (error) {
        console.log(`error in database connection  in config/database.js ${error}`);
        process.exit(1);
    }
}