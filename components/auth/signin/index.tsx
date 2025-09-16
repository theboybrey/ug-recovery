"use client";

import * as Yup from "yup";

import { Button, Input } from "@/components/core";

import Link from "next/link";
import React from "react";
import UserService from "@/services/user.service";
import toasts from "@/utils/toasts";
import { useAuthContext } from "@/hooks/userContext";
import { useFormik } from "formik";

// Footer component for the login page
const LoginFooter = () => (
  <footer
    style={{
      position: "fixed",
      left: 0,
      bottom: 0,
      width: "100%",
      background: "#f9fafb",
      color: "#6b7280",
      textAlign: "center",
      padding: "0.75rem 0",
      fontSize: "0.95rem",
      zIndex: 100,
    }}
  >
    &copy; {new Date().getFullYear()} All rights reserved.
  </footer>
);

const LoginPage = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { login } = useAuthContext();
  const { handleSubmit, ...form } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      UserService.login(values.email, values.password, (error, user) => {
        setLoading(false);
        if (!error) {
          login(user);
          window.location.href = "/dashboard";
          toasts.success("Login🎉", "Login Successful");
        } else {
          console.error(error);
          toasts.error("Login 👺", error);
        }
      });
    },
  });

  return (
    <div className="mx-auto w-full max-w-sm lg:w-96">
      <div className="text-left">
        <Link href={"/"} className="text-xl font-extrabold text-text">
          Login.
        </Link>
        <p className="mt-2 text-sm text-text">Welcome back to UGRecover!</p>
      </div>

      <div className="mt-8">
        <div className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="email"
                label="Email"
                type="email"
                required
                placeholder="eg. johndoe@email.com"
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                validation={form}
              />
            </div>

            <div className="space-y-1">
              <Input
                id="password"
                label="Password"
                type="password"
                required
                placeholder="Enter your password"
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                validation={form}
              />
            </div>
            <div>
              <Button type="submit" disabled={loading} className="w-full py-2">
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
