import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database connected"),
    );
    await mongoose.connect(process.env.MONGODB_URL_ATLAS, {
      dbName: "SocialMediaDB"
    });
  } catch (error) {
    console.log("Failed to connect database : ", error.message);
  }
};

export default connectDB;