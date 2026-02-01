"use client";

import { useState } from "react";
import { Login } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await Login(formData.email, formData.password);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.messages[0] || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image with Glassmorphism */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        {/* <Image
          src="/images/login-bg.jpg"
          alt="Login"
          fill
          className="object-cover"
          priority
        /> */}

        {/* Gradient Overlay with Glassmorphism */}
        <div className="absolute inset-0 bg-linear-to-br from-[#141C22] via-[#1A242C] to-[#0F161C]">
          {/* Subtle animated gradient orbs */}
          <div
            className="absolute top-32 left-32 w-72 h-72 bg-[#25343F]/25 rounded-full blur-[120px] animate-[pulse_4s_ease-in-out_infinite]"
          ></div>

          <div className="absolute bottom-20 right-32 w-96 h-96 bg-[#1E2A33]/20 rounded-full blur-[140px] animate-[pulse_5s_ease-in-out_infinite]
 delay-700"></div>

          <div
            className="absolute top-1/2 left-1/2 transform 
                  -translate-x-1/2 -translate-y-1/2 
                  w-80 h-80 bg-[#EAEFEF]/10 rounded-full blur-[160px] animate-[pulse_6s_ease-in-out_infinite]
 delay-1000"
          ></div>
        </div>

        {/* Glass Card Content */}
        <div className="relative w-full h-full flex flex-col items-center justify-center p-12">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl max-w-md">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl mb-6 border border-white/30 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                Wize-Invoice-Ai
              </h2>
              <p className="text-gray-200 text-lg leading-relaxed">
                Streamline your workflow and boost productivity with our
                powerful tools
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#EAEFEF] px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#141C22] rounded-2xl mb-4">
              <svg
                className="w-8 h-8 text-[#EAEFEF]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl text-center font-bold text-[#141C22] mb-2">
              Welcome Back
            </h1>
            <p className="text-[#BFC9D1] text-center">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#141C22] mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#EAEFEF] border border-[#BFC9D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141C22] focus:border-transparent text-[#141C22] placeholder-[#BFC9D1]"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#141C22] mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#EAEFEF] border border-[#BFC9D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141C22] focus:border-transparent text-[#141C22] placeholder-[#BFC9D1]"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#141C22] bg-[#EAEFEF] border-[#BFC9D1] rounded focus:ring-[#141C22] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-[#BFC9D1]">
                    Remember me
                  </span>
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-[#141C22] hover:underline font-medium"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#141C22] text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#141C22] focus:ring-offset-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#BFC9D1] text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="text-[#141C22] font-medium hover:underline"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[#BFC9D1] text-xs mt-8">
            © 2026 HOPn. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
