import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/navbar/Navbar";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

const emptyPasswordFields = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
};

const ProfilePage = () => {
  const { user, token, login } = useAuth();
  const [profile, setProfile] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
  }));
  const [passwords, setPasswords] = useState(emptyPasswordFields);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleProfileChange = (event) => {
    setProfile((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handlePasswordChange = (event) => {
    setPasswords((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const readResponse = async (response) => {
    const text = await response.text();
    let data = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "The server returned an invalid response. Please try again later.",
        );
      }
    }

    if (!response.ok) {
      throw new Error(data.message || "The request could not be completed.");
    }

    return data;
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setNotice(null);
    setIsSavingProfile(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await readResponse(response);

      if (!data.user) throw new Error("The updated profile was not returned.");

      const updatedUser = { ...user, ...data.user };
      login(updatedUser, token);
      setProfile({ name: updatedUser.name || "", email: updatedUser.email || "" });
      setNotice({ type: "success", text: "Profile updated successfully." });
    } catch (error) {
      console.error("Profile update error:", error);
      setNotice({ type: "error", text: error.message });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setNotice(null);

    if (passwords.password.length < 6) {
      setNotice({
        type: "error",
        text: "New password must be at least 6 characters long.",
      });
      return;
    }

    if (passwords.password !== passwords.confirmPassword) {
      setNotice({ type: "error", text: "New passwords do not match." });
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          password: passwords.password,
        }),
      });
      const data = await readResponse(response);
      setPasswords(emptyPasswordFields);
      setNotice({
        type: "success",
        text: data.message || "Password changed successfully.",
      });
    } catch (error) {
      console.error("Password change error:", error);
      setNotice({ type: "error", text: error.message });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] bg-[#f7f4ef] px-4 py-10 text-[#29241e] dark:bg-[#171511] dark:text-[#f3eee6] sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5 border-b border-[#b99467]/25 pb-7 sm:mb-11 sm:pb-9">
            <div>
              <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#927650] dark:text-[#c6a77d] sm:text-xs">
                <span className="h-px w-8 bg-current" aria-hidden="true" />
                G&amp;B / Member account
              </p>
              <h1 className="mt-3 font-serif text-4xl font-normal leading-none tracking-tight text-[#29241e] dark:text-[#f3eee6] sm:mt-4 sm:text-6xl">
                Profile
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[#71685e] dark:text-[#c4bbb0]">
                Manage your account details and password.
              </p>
            </div>
            <Link
              to="/my-orders"
              className="border border-[#b99467]/45 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#514332] transition-colors hover:border-[#927650] hover:bg-[#927650] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927650] dark:border-[#c6a77d]/35 dark:text-[#e8d8c3] dark:hover:bg-[#c6a77d] dark:hover:text-[#29241e]"
            >
              View my orders
            </Link>
          </div>

          <section className="border border-[#b99467]/25 bg-[#fffefa] p-5 dark:border-white/10 dark:bg-[#211e1a] sm:p-9">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-5 border-b border-[#b99467]/20 pb-7 dark:border-white/10 sm:mb-10">
              <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div
                aria-hidden="true"
                className="flex h-16 w-16 shrink-0 items-center justify-center border border-[#b99467]/45 bg-[#f7f1e8] font-serif text-sm tracking-[0.08em] text-[#765b3c] dark:border-[#c6a77d]/35 dark:bg-[#2b261f] dark:text-[#e2c6a2] sm:h-[76px] sm:w-[76px]"
              >
                G&amp;B
              </div>
              <div className="min-w-0">
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#927650] dark:text-[#c6a77d]">
                  G&amp;B member
                </p>
                <h2 className="truncate font-serif text-2xl font-normal text-[#29241e] dark:text-[#f3eee6] sm:text-3xl">
                  {user?.name || "Your account"}
                </h2>
                <p className="mt-1 truncate text-sm text-[#71685e] dark:text-[#c4bbb0]">
                  {user?.email}
                </p>
              </div>
              </div>
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8c8173] dark:text-[#b8ad9f]">
                Account details
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <h2 className="font-serif text-2xl font-normal text-[#29241e] dark:text-[#f3eee6]">
                Personal details
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
              <div>
                <label
                  htmlFor="profile-name"
                  className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71685e] dark:text-[#c4bbb0]"
                >
                  Full name
                </label>
                <input
                  id="profile-name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  autoComplete="name"
                  required
                  className="mt-2 w-full border-0 border-b border-[#d6cec2] bg-transparent px-0 py-3 text-sm text-[#29241e] outline-none transition placeholder:text-[#a39a8f] focus:border-[#927650] focus:ring-0 dark:border-white/20 dark:text-white dark:focus:border-[#c6a77d]"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-email"
                  className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71685e] dark:text-[#c4bbb0]"
                >
                  Email address
                </label>
                <input
                  id="profile-email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  autoComplete="email"
                  required
                  className="mt-2 w-full border-0 border-b border-[#d6cec2] bg-transparent px-0 py-3 text-sm text-[#29241e] outline-none transition placeholder:text-[#a39a8f] focus:border-[#927650] focus:ring-0 dark:border-white/20 dark:text-white dark:focus:border-[#c6a77d]"
                />
              </div>
              </div>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full bg-[#29241e] px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#514332] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650] disabled:cursor-wait disabled:opacity-60 dark:bg-[#eee7dc] dark:text-[#29241e] dark:hover:bg-white sm:w-auto"
              >
                {isSavingProfile ? "Saving…" : "Save changes"}
              </button>
            </form>

            <form
              onSubmit={handleChangePassword}
              className="mt-10 space-y-6 border-t border-[#b99467]/20 pt-8 dark:border-white/10 sm:mt-12 sm:pt-10"
            >
              <div>
                <h2 className="font-serif text-2xl font-normal text-[#29241e] dark:text-[#f3eee6]">
                  Change password
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#71685e] dark:text-[#c4bbb0]">
                  Google sign-in accounts can set a password without an existing one.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
              <div className="sm:col-span-2">
                <label
                  htmlFor="current-password"
                  className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71685e] dark:text-[#c4bbb0]"
                >
                  Current password
                </label>
                <input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  className="mt-2 w-full border-0 border-b border-[#d6cec2] bg-transparent px-0 py-3 text-sm text-[#29241e] outline-none transition focus:border-[#927650] focus:ring-0 dark:border-white/20 dark:text-white dark:focus:border-[#c6a77d]"
                />
              </div>
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71685e] dark:text-[#c4bbb0]"
                  >
                    New password
                  </label>
                  <input
                    id="new-password"
                    name="password"
                    type="password"
                    value={passwords.password}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                    minLength={6}
                    required
                    className="mt-2 w-full border-0 border-b border-[#d6cec2] bg-transparent px-0 py-3 text-sm text-[#29241e] outline-none transition focus:border-[#927650] focus:ring-0 dark:border-white/20 dark:text-white dark:focus:border-[#c6a77d]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71685e] dark:text-[#c4bbb0]"
                  >
                    Confirm new password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                    minLength={6}
                    required
                    className="mt-2 w-full border-0 border-b border-[#d6cec2] bg-transparent px-0 py-3 text-sm text-[#29241e] outline-none transition focus:border-[#927650] focus:ring-0 dark:border-white/20 dark:text-white dark:focus:border-[#c6a77d]"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full border border-[#b99467]/45 px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#514332] transition-colors hover:border-[#927650] hover:bg-[#927650] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650] disabled:cursor-wait disabled:opacity-60 dark:border-[#c6a77d]/35 dark:text-[#e8d8c3] dark:hover:bg-[#c6a77d] dark:hover:text-[#29241e] sm:w-auto"
              >
                {isChangingPassword ? "Updating…" : "Update password"}
              </button>
            </form>

            {notice && (
              <p
                className={`mt-6 border px-4 py-3 text-sm font-medium ${
                  notice.type === "success"
                    ? "border-emerald-700/20 bg-emerald-50 text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
                }`}
                role={notice.type === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {notice.text}
              </p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;
