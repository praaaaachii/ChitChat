import User from "@models/User";
import { connectToDB } from "@mongodb";
import { hash } from "bcryptjs";

export const POST = async (req, res) => {
  try {
    //connecting to mongodb
    await connectToDB();

    //getting the user from the request body after connection
    const body = await req.json();

    //destructuring the response body we just got from the db, into username, email and password
    const { username, email, password } = body;

    //checking for any existing user with email as a unique key (because we already set email as unique, in the schema)
    const existingUser = await User.findOne({ email });

    //if we found the user then just return with a positive status code-400
    if (existingUser) {
      return new Response("User already exists", {
        status: 400,
      });
    }

    //simply hashing the password
    const hashedPassword = await hash(password, 10);

    //creating a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    //saving the new user
    await newUser.save();

    //returning the new user with a positive status code-200
    return new Response(JSON.stringify(newUser), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to create a new user", {
      status: 500,
    });
  }
};
