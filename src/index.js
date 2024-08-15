// require('dotenv').config({path: './env'})
import dotenv from "dotenv";

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from "express";

import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error(error);
      throw error;
    });
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Server is running on port: http://localhost:${process.env.PORT}/`
      );
    });
  })
  .catch((err) => {
    console.log("Database connection failed!! ", err);
  });

/*
const app = express();
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.error(error);
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port http://localhost:${PORT}/`)
        })
    } catch (error) {
        console.error(error);
        throw error
    }
})();
*/
