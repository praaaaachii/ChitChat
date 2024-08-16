//this file is user-model for authentication
import mongoose from "mongoose";

//this is how we create a schema in mongo
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    //required makes the input mandatory, as the name suggests
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    //this also has a string type because it will be a url, this will only be available while logging-in so that the user can edit their profile image right before logging-in, not when a new user is registering
    type: String,
    default: "",
  },
  chats: {
    //this is the chats array, we are fetching the chatIds
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    default: [],
  }
});

//this line finds an existing user-model and if it doesn't find any then it creates a new user-model with a default name as User and new User-schema
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
