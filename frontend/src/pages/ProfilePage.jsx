import React, { useState, useEffect } from "react";
import Skeleton from "../components/Skeleton";
import { API_BASE_URL } from "../config/api";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setEditData({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          currentPassword: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();

    // Listen for logout event from navbar
    const handleLogoutEvent = () => {
      setUser(null);
      setMessage("");
    };

    window.addEventListener("user-logout", handleLogoutEvent);
    return () => window.removeEventListener("user-logout", handleLogoutEvent);
  }, []);

  const handleEditChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      if (!token) {
        setMessage("No token found. Please login again.");
        return;
      }

      const payload = {
        name: editData.name,
        email: editData.email,
      };

      const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch (error) {
          throw new Error(
            "The server returned an invalid response. Please make sure the backend is running.",
          );
        }
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setEditData({
        name: data.user.name || "",
        email: data.user.email || "",
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });
      setIsEditing(false);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage(error.message);
    }
  };

  const handleChangePassword = async () => {
    try {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      if (!token) {
        setMessage("No token found. Please login again.");
        return;
      }

      if (!editData.password.trim()) {
        setMessage("Please enter your new password.");
        return;
      }

      if (editData.password.length < 6) {
        setMessage("New password must be at least 6 characters long.");
        return;
      }

      if (editData.password !== editData.confirmPassword) {
        setMessage("New passwords do not match.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: editData.currentPassword,
          password: editData.password,
        }),
      });

      const text = await response.text();
      let data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch (error) {
          throw new Error(
            "The server returned an invalid response. Please make sure the backend is running.",
          );
        }
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setEditData({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });
      setMessage("Password changed successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Password change error:", error);
      setMessage(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
        <div
          role="status"
          aria-label="Loading profile"
          className="mx-auto max-w-2xl"
        >
          <Skeleton className="mb-8 h-12 w-full rounded-full" />
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900 sm:p-8">
            <Skeleton className="h-8 w-2/5" />
            <div className="mt-8 space-y-6">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-36 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <div className="text-center rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-900">
          <h1 className="mb-4 text-2xl font-black text-gray-900 dark:text-white">
            Not Logged In
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Please login to view your profile.
          </p>
          <button
            onClick={() => {
              window.location.hash = "login";
            }}
            className="rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-secondary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-2xl">
        {/* HEADER */}
        <div className="mb-8">
          <button
            onClick={() => {
              window.location.hash = "";
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3.5 font-bold text-white shadow-lg shadow-primary/30 transition duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-secondary/30"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </button>
        </div>

        {/* PROFILE CARD */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-900">
          {/* AVATAR AND USER INFO */}
          <div className="mb-8 flex flex-col items-center gap-6">
            {/* AVATAR */}
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg">
              <span className="text-4xl font-black text-white">
                {user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "U"}
              </span>
            </div>

            {/* NAME AND EMAIL */}
            <div className="text-center">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                {user.name || "User"}
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="mb-8 h-px bg-gray-200 dark:bg-gray-700" />

          {/* PROFILE INFO SECTION */}
          {!isEditing ? (
            <div className="space-y-6">
              {/* USER ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
                  User ID
                </label>
                <p className="mt-2 rounded-lg bg-gray-50 px-4 py-3 font-mono text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {user.id || "N/A"}
                </p>
              </div>

              {/* NAME */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Full Name
                </label>
                <p className="mt-2 rounded-lg bg-gray-50 px-4 py-3 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {user.name || "Not set"}
                </p>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Email Address
                </label>
                <p className="mt-2 rounded-lg bg-gray-50 px-4 py-3 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {user.email || "Not set"}
                </p>
              </div>

              {/* MEMBER SINCE */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Member Since
                </label>
                <p className="mt-2 rounded-lg bg-gray-50 px-4 py-3 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full rounded-full bg-primary px-4 py-3 font-semibold text-white transition hover:bg-secondary"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            /* EDIT MODE */
            <div className="space-y-6">
              {/* NAME INPUT */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-gray-900 outline-none transition focus:border-primary dark:border-gray-700 dark:text-white"
                />
              </div>

              {/* EMAIL INPUT */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-gray-900 outline-none transition focus:border-primary dark:border-gray-700 dark:text-white"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 rounded-full bg-primary px-4 py-3 font-semibold text-white transition hover:bg-secondary"
                >
                  Save Profile Details
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({
                      name: user.name || "",
                      email: user.email || "",
                      currentPassword: "",
                      password: "",
                      confirmPassword: "",
                    });
                  }}
                  className="flex-1 rounded-full border-2 border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                  Change Password
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Current Password (if you have one)
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={editData.currentPassword}
                      onChange={handleEditChange}
                      placeholder="Required for an existing password"
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={editData.password}
                      onChange={handleEditChange}
                      placeholder="Enter a new password"
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={editData.confirmPassword}
                      onChange={handleEditChange}
                      placeholder="Confirm your new password"
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleChangePassword}
                    className="w-full rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-3 font-semibold text-white shadow-md shadow-primary/20 transition hover:shadow-lg hover:shadow-secondary/30"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MESSAGE */}
          {message && (
            <div
              className={`mt-6 rounded-lg px-4 py-3 text-center text-sm font-semibold ${
                message.includes("successfully")
                  ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* ACCOUNT STATS */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow dark:border-gray-700 dark:bg-gray-900">
            <p className="text-2xl font-black text-primary">∞</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Products
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow dark:border-gray-700 dark:bg-gray-900">
            <p className="text-2xl font-black text-secondary">0</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Orders
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow dark:border-gray-700 dark:bg-gray-900">
            <p className="text-2xl font-black text-green-500">✓</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
