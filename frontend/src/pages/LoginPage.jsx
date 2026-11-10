import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";
import { useLocation, useNavigate } from "react-router-dom";
import AuthImage from "../assets/products/brownjacket.jpg";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [authenticatedName, setAuthenticatedName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!successMessage) return undefined;

    const timer = window.setTimeout(() => {
      const returnTo = location.state?.from;
      const destination = returnTo
        ? `${returnTo.pathname || "/"}${returnTo.search || ""}${returnTo.hash || ""}`
        : "/";

      navigate(destination, {
        replace: true,
        state: returnTo
          ? null
          : { loginSuccess: true, userName: authenticatedName },
      });
    }, 900);

    return () => window.clearTimeout(timer);
  }, [authenticatedName, location.state, navigate, successMessage]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (message) setMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      if (!response.ok) throw new Error(data.message || "Login failed");

      if (data.token) {
        login(data.user, data.token);
      }

      setAuthenticatedName(data.user?.name || "");
      setSuccessMessage(
        location.state?.from
          ? "Signed in successfully. Taking you back to your account…"
          : "Signed in successfully. Taking you home…",
      );
    } catch (error) {
      const isInvalidCredentials =
        error.message?.toLowerCase() === "invalid email or password";
      setMessage(
        isInvalidCredentials
          ? "We couldn't sign you in with those details. Check your email and password, then try again."
          : error.message ||
              "We couldn't sign you in right now. Check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f0ece5] p-0 text-[#29241e] dark:bg-[#15130f] dark:text-[#f3eee6] sm:p-5 lg:p-8">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl overflow-hidden bg-[#fbf9f5] shadow-[0_30px_90px_-40px_rgba(47,35,23,0.5)] dark:bg-[#211e1a] sm:min-h-[min(860px,calc(100vh-2.5rem))] sm:rounded-sm lg:min-h-[min(900px,calc(100vh-4rem))] md:grid-cols-2">
        <aside className="relative min-h-[250px] overflow-hidden bg-[#4b3427] sm:min-h-[300px] md:min-h-full">
          <img
            src={AuthImage}
            alt="A tailored jacket from the G&B collection"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17120f]/85 via-[#17120f]/15 to-[#17120f]/20" />
          <div className="absolute inset-x-0 top-0 flex items-center gap-3 px-7 py-6 sm:px-10 sm:py-8">
            <span className="flex h-10 w-10 items-center justify-center border border-white/60 font-serif text-sm tracking-tight text-white">
              G&B
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-white">
              G&B Store
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10 lg:p-12">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e2c6a2]">
              Considered style. Timelessly yours.
            </p>
            <h2 className="max-w-sm font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
              Pieces to keep. Moments to remember.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
              Discover a more personal way to dress, with a collection chosen
              for everyday elegance.
            </p>
          </div>
        </aside>

        <section className="flex items-center justify-center px-6 py-12 sm:px-12 md:px-10 lg:px-16">
          <div className="w-full max-w-md">
            <p className="mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-[#927650] dark:text-[#c6a77d]">
              Member access
            </p>
            <h1 className="text-center font-serif text-4xl font-normal tracking-tight text-[#29241e] dark:text-[#f3eee6] sm:text-5xl">
              Welcome back
            </h1>
            <p className="mb-9 mt-3 text-center text-sm text-[#71685e] dark:text-[#c4bbb0]">
              Sign in to continue your G&B experience.
            </p>

            {successMessage && (
              <p
                className="mb-6 border border-emerald-700/20 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-950/40 dark:text-emerald-200"
                role="status"
                aria-live="polite"
              >
                {successMessage}
              </p>
            )}

            {location.state?.requiresAuth && (
              <p
                className="mb-6 border border-[#c6a77d]/40 bg-[#c6a77d]/10 px-4 py-3 text-center text-sm text-[#514332] dark:text-[#e8d8c3]"
                role="status"
              >
                Please sign in before accessing the ordering page.
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="login-email"
                  className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#71685e] dark:text-[#c4bbb0]"
                >
                  Email address
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(message)}
                  className={`mt-2 w-full border-0 border-b bg-transparent px-0 py-3 text-sm text-[#29241e] outline-none transition placeholder:text-[#a39a8f] focus:ring-0 dark:text-white ${message ? "border-red-500 focus:border-red-500" : "border-[#d6cec2] focus:border-[#927650] dark:border-white/20 dark:focus:border-[#c6a77d]"}`}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#71685e] dark:text-[#c4bbb0]"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={Boolean(message)}
                  className={`mt-2 w-full border-0 border-b bg-transparent px-0 py-3 text-sm text-[#29241e] outline-none transition placeholder:text-[#a39a8f] focus:ring-0 dark:text-white ${message ? "border-red-500 focus:border-red-500" : "border-[#d6cec2] focus:border-[#927650] dark:border-white/20 dark:focus:border-[#c6a77d]"}`}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1 text-xs text-[#71685e] dark:text-[#c4bbb0]">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[#927650] focus:ring-[#927650]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="transition-colors hover:text-[#927650] dark:hover:text-[#c6a77d]"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || Boolean(successMessage)}
                className="mt-2 min-h-12 w-full bg-[#29241e] px-5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#514332] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-[#eee7dc] dark:text-[#29241e] dark:hover:bg-white"
              >
                {isSubmitting ? "Signing you in…" : "Sign in"}
              </button>
            </form>

            {message && (
              <div
                className="auth-error-alert mt-5 flex gap-3 border border-red-300 bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
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

            <p className="mt-8 text-center text-sm text-[#71685e] dark:text-[#c4bbb0]">
              New to G&B?{" "}
              <button
                type="button"
                onClick={() => {
                  window.location.hash = "register";
                }}
                className="font-semibold text-[#765b3c] underline decoration-[#c6a77d]/60 underline-offset-4 hover:text-[#514332] dark:text-[#d3b58d] dark:hover:text-white"
              >
                Create an account
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
