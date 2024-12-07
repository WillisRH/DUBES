import mongoose from "mongoose";

const connectMongoDB = async () => {
  const mongouri: any = process.env.MONGODB_URI
  try {
    await mongoose.connect(mongouri);
    // console.log(process.env.MONGODB_URI)
    // console.log("Connected to MongoDB.");
  } catch (error) {
    console.log(error);
  }
};

export default connectMongoDB;