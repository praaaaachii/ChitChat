//this file is for connecting mongo database to the app
import mongoose from "mongoose";

//by default we set the connection check var as false so we can keep check on the connection
let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  
  //if the connection is already established then we don't need to connect again
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }
  
  //if not connected then we are connecting here
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "ChitChat",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    //now since we established the connection so we set the flag variable as true
    isConnected = true;

    console.log("MongoDB is connected successfully");
  } catch (error) {
    console.log(error);
  }
};
