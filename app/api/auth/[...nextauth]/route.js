import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { connectToDB } from "@mongodb";
import User from "@models/User";

// creating a handler for managing login function
const handler = NextAuth({
  providers: [
    // this provider of next-auth allows to enable sign-in using username and password
    CredentialsProvider({
      name: "Credentials",

      // to authorize the credentials
      async authorize(credentials, req) {
        // if no username or password entered correctly
        if (!credentials.email || !credentials.password) {
          throw new Error("Invalid email or password");
        }

        // we will come here only if entered correctly and then we are connecting to the db for verification
        await connectToDB();

        //for checking that the user is existing or not
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user?.password) {
          throw new Error("Invalid email or password");
        }
        
        //for checking if the details match with the existing data or not
        const isMatch = await compare(credentials.password, user.password);
        
        if (!isMatch) {
          throw new Error("Invalid password");
        }
        
        //came here if everything is fine
        return user;
      },
    }),
  ],

  
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({session}) {
      const mongodbUser = await User.findOne({ email: session.user.email });
      // getting user id for the session
      session.user.id = mongodbUser._id.toString();

      //combining session user id with the data in the db
      session.user = {...session.user, ...mongodbUser._doc};

      return session;
    }
  }
});

export { handler as GET, handler as POST };
