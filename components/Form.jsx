"use client";

import {
  EmailOutlined,
  LockOutlined,
  PersonOutline,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react"

const Form = ({ type }) => {
  const {
    //this is a key-value pair variable which is a feature of react-hook form library
    register,
    handleSubmit,
    //this will show error msg whenever error is found
    formState: { errors },
  } = useForm();

  //useRouter is a next-navigation library used for efficient routing, here we are creating an instance of the class and this instance keeps all the routing info of the app
  const router = useRouter();

  //this function will be called whenever the form is submitted
  const onSubmit = async (data) => {
    //logic for the register choice
    if (type === "register") {
      //fetching the user api response, using the post method so to push the new details
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        //here we are compiling all data into json format and passing it to body, the data contains: username, email and password
        body: JSON.stringify(data),
      });

      //if everything is fine then we are pushing/going to the login page
      if (res.ok) {
        router.push("/");
      }

      if (res.error) {
        //this toast is react library used for beautiful toasts
        toast.error("Something went wrong");
      }
    }

    //logic for the login choice
    if (type === "login") {
      const res = await signIn("credentials", {
        //destructuring data into email and password
        ...data,
        redirect: false,
      })

      //if everything is fine then we are routing to the chat screen
      if (res.ok) {
        router.push("/chats");
      }

      if (res.error) {
        toast.error("Invalid email or password");
      }
    }
  };



  return (
    <div className="auth">
      <div className="content">
        <img src="/assets/logo.png" alt="logo" className="logo" />

        {/* //here we are calling the onSubmit function */}
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          {/* //checks if the user is registering for the first time then we give him the option to also provide a username, if the user already have an account then we will not show this username input field option */}
          {type === "register" && (
            <div>
              <div className="input">
                <input
                  //this default value is for the very first time load
                  defaultValue=""
                  // these 3-dots is called spread-operator and is used to deconstruct any array or object in separate variables
                  {...register("username", {
                    //this part below shows only when the input-field is left empty
                    required: "Username is required",
                    //basic validation logic
                    validate: (value) => {
                      if (value.length < 3) {
                        return "Username must be at least 3 characters";
                      }
                    },
                  })}
                  type="text"
                  placeholder="Username"
                  className="input-field"
                />
                {/* //this component is imported from the react-icons library */}
                <PersonOutline sx={{ color: "#737373" }} />
              </div>
              {/* //this is to show the error msg */}
              {errors.username && (
                <p className="error-warning">{errors.username.message}</p>
              )}
            </div>
          )}

          <div>
            <div className="input">
              <input
                defaultValue=""
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="Email"
                className="input-field"
              />
              <EmailOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.email && (
              <p className="error-warning">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="input">
              <input
                defaultValue=""
                {...register("password", {
                  required: "Password is required",

                  //password validation logic
                  validate: (value) => {
                    if (
                      value.length < 5 ||
                      !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
                    ) {
                      return "Password must be at least 5 characters and contain at least one special character";
                    }
                  },
                })}
                type="password"
                placeholder="Password"
                className="input-field"
              />
              <LockOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.password && (
              <p className="error-warning">{errors.password.message}</p>
            )}
          </div>

          <button className="button" type="submit">
            {type === "register" ? "Join Free" : "Let's Chat"}
          </button>
        </form>

        {/* // same as told above, register/login check based ui logic */}
        {type === "register" ? (
          <Link href="/" className="link">
            <p className="text-center">Already have an account? Sign In Here</p>
          </Link>
        ) : (
          <Link href="/register" className="link">
            <p className="text-center">Do not have an account? Register Here </p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Form;
