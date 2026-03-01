import express from "express";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userAuthRouter from "./routes/userAuthRoutes.js";
import cookieParser from "cookie-parser";
const app = express();

await connectDB();

app.use(express.json()); //middleware to parse JSON data
app.use(cookieParser()); //middleware to pase Cookies
app.use("/", userAuthRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is listening on port :", PORT);
});
