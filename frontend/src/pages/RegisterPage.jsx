import React, { useState, useEffect } from "react";
import AuthSuccessModal from "../components/AuthSuccessModal";
import { API_BASE_URL } from "../config/api";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (message && !isSuccess) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      let data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            "The server returned an invalid response. Please make sure the backend is running.",
          );
        }
      }

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage(`Welcome ${data.user?.name || "there"}!`);
      setIsSuccess(true);

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(
        error.message ||
          "We couldn't create your account. Please check your details and try again.",
      );
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        window.location.hash = "";
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
      {isSuccess && (
        <AuthSuccessModal title="Account created" message={message} />
      )}

      <div className="mb-8 flex justify-center">
        <div className="flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm dark:border-white/10 dark:bg-gray-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-sm font-black text-white shadow-md">
            G&B
          </span>
          <span className="text-lg font-black tracking-[0.25em] text-gray-900 dark:text-white">
            STORE
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <h1 className="mb-6 text-center text-3xl font-black text-gray-900 dark:text-white">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              aria-invalid={Boolean(message && !isSuccess)}
              className={`w-full rounded-xl border bg-transparent px-4 py-3 text-gray-900 outline-none transition focus:border-primary dark:text-white ${message && !isSuccess ? "border-red-500 ring-2 ring-red-100 dark:border-red-400 dark:ring-red-950" : "border-gray-300 dark:border-gray-700"}`}
              required
            />
          </div>

          <div>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              aria-invalid={Boolean(message && !isSuccess)}
              className={`w-full rounded-xl border bg-transparent px-4 py-3 text-gray-900 outline-none transition focus:border-primary dark:text-white ${message && !isSuccess ? "border-red-500 ring-2 ring-red-100 dark:border-red-400 dark:ring-red-950" : "border-gray-300 dark:border-gray-700"}`}
              required
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              aria-invalid={Boolean(message && !isSuccess)}
              className={`w-full rounded-xl border bg-transparent px-4 py-3 text-gray-900 outline-none transition focus:border-primary dark:text-white ${message && !isSuccess ? "border-red-500 ring-2 ring-red-100 dark:border-red-400 dark:ring-red-950" : "border-gray-300 dark:border-gray-700"}`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-primary px-4 py-3 text-base font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
          <span className="text-sm font-medium uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
            OR
          </span>
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              window.location.hash = "login";
            }}
            className="font-semibold text-primary hover:underline"
          >
            Login
          </button>
        </p>

        {message && !isSuccess && (
          <div
            className="auth-error-alert mt-5 flex gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-800 shadow-sm dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
            role="alert"
            aria-live="assertive"
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-black text-white"
              aria-hidden="true"
            >
              !
            </span>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
