import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
} from "lucide-react";

import API from "../API/api";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
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

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      if (response.data.success) {
        login(response.data.user);

        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);

      const message =
        error.response?.data?.message ||
        "Unable to create your account. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="grid min-h-screen lg:grid-cols-[1fr_0.9fr]">
        {/* ================= LEFT ================= */}
        <div className="relative hidden overflow-hidden border-r border-white/10 lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:42px_42px]" />

          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-indigo-500/[0.06] blur-3xl" />

          <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
            <Link
              to="/"
              className="flex w-fit items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500">
                <Sparkles size={17} />
              </div>

              <span className="text-sm font-semibold tracking-tight">
                SiteCraft AI
              </span>
            </Link>

            <div className="max-w-lg">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-indigo-300">
                Build without limits
              </p>

              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white xl:text-5xl">
                Turn your ideas into real websites.
              </h1>

              <p className="mt-5 max-w-md text-sm leading-6 text-zinc-500">
                Describe what you want to build and let SiteCraft AI create
                editable React code that you can customize and ship.
              </p>

              <div className="mt-8 grid max-w-md grid-cols-3 gap-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
                  <p className="text-lg font-semibold text-zinc-200">AI</p>
                  <p className="mt-1 text-[10px] text-zinc-600">
                    Generation
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
                  <p className="text-lg font-semibold text-zinc-200">React</p>
                  <p className="mt-1 text-[10px] text-zinc-600">
                    Source code
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
                  <p className="text-lg font-semibold text-zinc-200">ZIP</p>
                  <p className="mt-1 text-[10px] text-zinc-600">
                    Export
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-700">
              © 2026 SiteCraft AI
            </p>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            {/* Back */}
            <Link
              to="/login"
              className="mb-8 inline-flex items-center gap-2 text-xs text-zinc-600 transition hover:text-white"
            >
              <ArrowLeft size={14} />
              Back to login
            </Link>

            {/* Heading */}
            <div>
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 lg:hidden">
                <Sparkles size={17} />
              </div>

              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-zinc-600">
                Start building your first AI-powered website.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-xs leading-5 text-red-300">
                {error}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-4"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-medium text-zinc-400"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="name"
                  disabled={loading}
                  className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.025] px-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-indigo-500/50 focus:bg-white/[0.035] disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-zinc-400"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                  className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.025] px-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-indigo-500/50 focus:bg-white/[0.035] disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-medium text-zinc-400"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.025] px-3.5 pr-11 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-indigo-500/50 focus:bg-white/[0.035] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 transition hover:text-zinc-300 disabled:cursor-not-allowed"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-medium text-zinc-400"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.025] px-3.5 pr-11 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-indigo-500/50 focus:bg-white/[0.035] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 transition hover:text-zinc-300 disabled:cursor-not-allowed"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) =>
                    setAcceptedTerms(e.target.checked)
                  }
                  disabled={loading}
                  className="mt-0.5 h-3.5 w-3.5 accent-indigo-500"
                />

                <span className="text-[11px] leading-5 text-zinc-600">
                  I agree to the SiteCraft AI terms and privacy policy.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            {/* Login */}
            <p className="mt-7 text-center text-xs text-zinc-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-zinc-300 transition hover:text-white"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;