import express from "express";
import "dotenv/config";
import connectDB from "./configs/db.js";
import User from "./models/User.js";
const app = express();

await connectDB();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const { full_name, username, email, password } = req.body;
    const userObj = User({
      full_name,
      username,
      email,
      password,
    });

    const user = await userObj.save();
    res.send(user);
  } catch (err) {
    res.status(400).json({ success: false, message: "Error : " + err.message });
  }
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "Hello from server.." });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is listening on port :", PORT);
});
