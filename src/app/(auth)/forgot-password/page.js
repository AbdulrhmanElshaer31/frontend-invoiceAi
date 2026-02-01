"use client";

import { useState } from "react";
import { resetPswdOtp, validatePswdOtp, resetPassword } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await resetPswdOtp(email);

      if (result.success) {
        setMessage(result.messages[0]);
        setStep(2);
      } else {
        setError(result.messages[0]);
      }
    } catch (err) {
      setError("Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleValidateOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await validatePswdOtp(email, otp);

      if (result.success) {
        setMessage(result.messages[0]);
        setStep(3);
      } else {
        setError(result.messages[0]);
      }
    } catch (err) {
      setError("Failed to validate code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: email,
        newPassword: formData.password,
        confirmpassword: formData.confirmPassword,
      };

      const result = await resetPassword(payload);

      if (result.success) {
        setMessage(result.messages[0]);
        setStep(4);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(result.messages[0]);
      }
    } catch (err) {
      setError("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await resetPswdOtp(email);
      if (result.success) {
        setMessage(result.messages[0]);
      } else {
        setError(result.messages[0]);
      }
    } catch (err) {
      setError("Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image with Glassmorphism */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        {/* <Image
          src="/images/forgot-password-bg.jpg"
          alt="Reset Password"
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
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                Account Recovery
              </h2>
              <p className="text-gray-200 text-lg leading-relaxed">
                Don&apos;t worry, we&apos;ll help you reset your password and
                get back to work
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
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-center text-3xl font-bold text-[#141C22] mb-2">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Verify Code"}
              {step === 3 && "Reset Password"}
              {step === 4 && "Password Reset"}
            </h1>
            <p className="text-center text-[#BFC9D1]">
              {step === 1 && "Enter your email to receive a reset code"}
              {step === 2 && "Enter the code we sent to your email"}
              {step === 3 && "Create a new password for your account"}
              {step === 4 && "Your password has been reset successfully"}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1
                    ? "bg-[#141C22] text-white"
                    : "bg-[#BFC9D1] text-white"
                }`}
              >
                1
              </div>
              <div
                className={`w-12 h-1 ${
                  step >= 2 ? "bg-[#141C22]" : "bg-[#BFC9D1]"
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2
                    ? "bg-[#141C22] text-white"
                    : "bg-[#BFC9D1] text-white"
                }`}
              >
                2
              </div>
              <div
                className={`w-12 h-1 ${
                  step >= 3 ? "bg-[#141C22]" : "bg-[#BFC9D1]"
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 3
                    ? "bg-[#141C22] text-white"
                    : "bg-[#BFC9D1] text-white"
                }`}
              >
                3
              </div>
              <div
                className={`w-12 h-1 ${
                  step >= 4 ? "bg-[#141C22]" : "bg-[#BFC9D1]"
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 4
                    ? "bg-[#141C22] text-white"
                    : "bg-[#BFC9D1] text-white"
                }`}
              >
                4
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Step 1: Request Reset Code */}
            {step === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#141C22] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#EAEFEF] border border-[#BFC9D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141C22] focus:border-transparent text-[#141C22]"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#141C22] text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending Code..." : "Send Reset Code"}
                </button>

                <div className="text-center">
                  <a
                    href="/login"
                    className="text-[#141C22] text-sm font-medium hover:underline"
                  >
                    Back to Login
                  </a>
                </div>
              </form>
            )}

            {/* Step 2: Verify OTP */}
            {step === 2 && (
              <form onSubmit={handleValidateOtp} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                    {message}
                  </div>
                )}

                <div className="text-center mb-6">
                  <p className="text-[#BFC9D1] text-sm">
                    We&apos;ve sent a reset code to
                  </p>
                  <p className="text-[#141C22] font-medium">{email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#141C22] mb-2">
                    Reset Code
                  </label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full px-4 py-3 bg-[#EAEFEF] border border-[#BFC9D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141C22] focus:border-transparent text-[#141C22] text-center text-2xl tracking-widest"
                    placeholder="000000"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#141C22] text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="w-full text-[#141C22] py-2 text-sm font-medium hover:underline disabled:opacity-50"
                >
                  Resend Code
                </button>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#141C22] mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#EAEFEF] border border-[#BFC9D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141C22] focus:border-transparent text-[#141C22]"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-[#BFC9D1] mt-1">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#141C22] mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-[#EAEFEF] border border-[#BFC9D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141C22] focus:border-transparent text-[#141C22]"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#141C22] text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </button>
              </form>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#141C22] mb-2">
                  Password Reset Complete!
                </h3>
                <p className="text-[#BFC9D1] mb-6">
                  {message || "Redirecting to login..."}
                </p>
                <a
                  href="/login"
                  className="inline-block bg-[#141C22] text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200"
                >
                  Go to Login
                </a>
              </div>
            )}
          </div>

          <p className="text-center text-[#BFC9D1] text-xs mt-8">
            © 2026 HOPn. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
