"use client";

import * as Yup from "yup";

import { Button, Input } from "@/components/core";

import { IRoles } from "@/models/roles.model";
import Link from "next/link";
import React from "react";
import UserService from "@/services/user.service";
import toasts from "@/utils/toasts";
import { useAuthContext } from "@/hooks/userContext";
import { useFormik } from "formik";

// Role options
const roleOptions = [
  { value: "sudo", label: "Super Admin", description: "System Administrator" },
  {
    value: "officer",
    label: "Officer",
    description: "Collection Point Officer",
  },
  { value: "student", label: "Student", description: "Student/Public User" },
];

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
  const { handleSubmit, setFieldValue, ...form } = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "STUDENT", // Default to student
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      role: Yup.string()
        .oneOf(["sudo", "officer", "student"], "Please select a valid role")
        .required("Role is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      UserService.login(
        values.email,
        values.password,
        values.role as IRoles,
        (error, user) => {
          setLoading(false);
          if (!error) {
            // Include role in login process
            login({ ...user, role: values.role });
            window.location.href = "/dashboard";
          } else {
            console.error(error);
            toasts.error("Login 👺", error);
          }
        }
      );
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

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-text">
                Select Role <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-1 gap-3">
                {roleOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                      form.values.role === option.value
                        ? "border-primary-600 bg-primary-50 ring-2 ring-primary-600"
                        : "border-card-border bg-card-bg hover:bg-surface"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={form.values.role === option.value}
                      onChange={() => setFieldValue("role", option.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          form.values.role === option.value
                            ? "border-primary-600 bg-primary-600"
                            : "border-gray-300"
                        }`}
                      >
                        {form.values.role === option.value && (
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <div
                          className={`text-sm font-medium ${
                            form.values.role === option.value
                              ? "text-primary-700"
                              : "text-text"
                          }`}
                        >
                          {option.label}
                        </div>
                        <div
                          className={`text-xs ${
                            form.values.role === option.value
                              ? "text-primary-600"
                              : "text-text-muted"
                          }`}
                        >
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {form.touched.role && form.errors.role && (
                <p className="text-xs text-error">{form.errors.role}</p>
              )}
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
