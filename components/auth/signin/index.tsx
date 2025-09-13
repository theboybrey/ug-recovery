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
      phone: "",
      pin: "",
    },
    validationSchema: Yup.object().shape({
      phone: Yup.string().length(10).required(),
      pin: Yup.string().length(6).required(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      UserService.login(values.phone, values.pin, (error, user) => {
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
    <>
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div className="text-left">
          <Link href={"/"} className="text-xl font-extrabold text-text">
            Login.
          </Link>
          <p className="mt-2 text-sm text-text">Welcome back to UniRecover!</p>
        </div>

        <div className="mt-8">
          <div className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  id="phone"
                  label="Phone"
                  type="text"
                  required
                  placeholder="eg. 0233445567"
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  validation={form}
                />
              </div>

              <div className="space-y-1">
                <Input
                  id="pin"
                  label="Pin"
                  type="text"
                  required
                  placeholder="e.g.  .............."
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  validation={form}
                />
              </div>
              <div>
                <Button type="submit" disabled={loading} className="w-full py-2 h-12">
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <LoginFooter />
    </>
  );
};

export default LoginPage;
