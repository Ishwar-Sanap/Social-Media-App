import express from "express";
import "dotenv/config";
import connectDB from "./configs/db.js";
import cookieParser from "cookie-parser";
import userAuthRouter from "./routes/userAuthRoutes.js";
import userProfileRouter from "./routes/userProfileRoutes.js";
const app = express();

await connectDB();

app.use(express.json()); //middleware to parse JSON data
app.use(cookieParser()); //middleware to pase Cookies
app.use("/", userAuthRouter);
app.use("/", userProfileRouter)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is listening on port :", PORT);
});
