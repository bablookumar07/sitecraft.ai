import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import API from "../API/api";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      console.log("Login response:", response.data);

      if (response.data.success) {
        login(response.data.user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* ================= LEFT PANEL ================= */}
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-zinc-950 lg:flex">

          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">

            {/* Logo */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="group flex w-fit items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] transition group-hover:border-white/20 group-hover:bg-white/[0.1]">
                <Sparkles
                  size={17}
                  className="text-white"
                />
              </div>

              <span className="text-sm font-semibold tracking-tight">
                SiteCraft AI
              </span>
            </button>

            {/* Main message */}
            <div className="max-w-xl">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                AI-powered website generation
              </div>

              <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-white xl:text-5xl">
                Turn your ideas into

                <span className="block text-zinc-500">
                  production-ready websites.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-7 text-zinc-400">
                Generate complete React websites from a simple prompt,
                refine the source code, preview your work, and publish
                when you're ready.
              </p>

              {/* Feature cards */}
              <div className="mt-10 grid max-w-lg grid-cols-2 gap-3">

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
                    <Sparkles
                      size={15}
                      className="text-zinc-300"
                    />
                  </div>

                  <p className="text-sm font-medium text-white">
                    Generate with AI
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Describe your idea and let AI build the foundation.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
                    <ShieldCheck
                      size={15}
                      className="text-zinc-300"
                    />
                  </div>

                  <p className="text-sm font-medium text-white">
                    Your code, your control
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Edit the generated source whenever you want.
                  </p>
                </div>

              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} SiteCraft AI
            </p>

          </div>
        </section>

        {/* ================= RIGHT PANEL ================= */}
        <section className="flex min-h-screen flex-col">

          {/* Top navigation */}
          <div className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-10">

            <button
              type="button"
              onClick={() => navigate("/")}
              className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-0.5"
              />

              Back to home
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="group inline-flex items-center gap-2 text-sm text-zinc-300 transition hover:text-white"
            >
              Create account

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>

          </div>

          {/* Form wrapper */}
          <div className="flex flex-1 items-center justify-center px-5 pb-12 pt-6 sm:px-8 lg:px-10">

            <div className="w-full max-w-md">

              {/* Mobile logo */}
              <div className="mb-10 lg:hidden">

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
                    <Sparkles size={17} />
                  </div>

                  <span className="text-sm font-semibold">
                    SiteCraft AI
                  </span>
                </button>

              </div>

              {/* Heading */}
              <div className="mb-8">

                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                  <LockKeyhole
                    size={19}
                    className="text-zinc-300"
                  />
                </div>

                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Sign in to continue building your next website.
                </p>

              </div>

              {/* Error message */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Login form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Email */}
                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Email address
                  </label>

                  <div className="relative">

                    <Mail
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={isLoading}
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-white/20 focus:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                </div>

                {/* Password */}
                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-zinc-300"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs text-zinc-500 transition hover:text-zinc-300"
                      onClick={() => {
                        console.log("Forgot password clicked");
                      }}
                    >
                      Forgot password?
                    </button>

                  </div>

                  <div className="relative">

                    <LockKeyhole
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                    />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isLoading}
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-12 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-white/20 focus:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-white/[0.05] hover:text-zinc-300"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-zinc-950" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in

                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>

              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">

                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs text-zinc-600">
                  or
                </span>

                <div className="h-px flex-1 bg-white/10" />

              </div>

              {/* Create account */}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.02] text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
              >
                Create a new account
              </button>

              {/* Security note */}
              <div className="mt-8 flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">

                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-zinc-500"
                />

                <p className="text-xs leading-5 text-zinc-600">
                  Your session is protected with a secure
                  HTTP-only authentication cookie.
                </p>

              </div>

              {/* Terms */}
              <p className="mt-7 text-center text-xs leading-5 text-zinc-600">

                By continuing, you agree to SiteCraft AI's{" "}

                <button
                  type="button"
                  className="text-zinc-400 hover:text-white"
                >
                  Terms
                </button>

                {" "}and{" "}

                <button
                  type="button"
                  className="text-zinc-400 hover:text-white"
                >
                  Privacy Policy
                </button>

                .

              </p>

            </div>

          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;