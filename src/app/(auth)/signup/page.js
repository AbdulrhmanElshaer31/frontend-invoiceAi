"use client";

import { useState } from "react";
import { requestOtp, validateOtop, SignUp } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Success
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validation
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
      const result = await requestOtp(formData.email);

      if (result.success) {
        setMessage(result.message[0]);
        setStep(2);
      } else {
        setError(result.message[0]);
      }
    } catch (err) {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleValidateOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const validateResult = await validateOtop(formData.email, otp);

      if (validateResult.success && validateResult.emailConfirmed) {
        // Now create the account
        const signupPayload = {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          emailConfirmed: true,
        };

        const signupResult = await SignUp(signupPayload);

        if (signupResult.success) {
          setMessage(signupResult.message[0]);
          setStep(3);
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          setError(signupResult.message[0]);
        }
      } else {
        setError(validateResult.message[0]);
      }
    } catch (err) {
      setError("Failed to validate OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await requestOtp(formData.email);
      if (result.success) {
        setMessage(result.message[0]);
      } else {
        setError(result.message[0]);
      }
    } catch (err) {
      setError("Failed to resend OTP");
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
          src="/images/signup-bg.jpg"
          alt="Sign Up"
          fill
          className="object-cover"
          priority
        /> */}

        {/* Gradient Overlay with Glassmorphism */}
        <div className="absolute inset-0 bg-linear-to-br from-[#141C22] via-[#1A242C] to-[#0F161C]">
          {/* Subtle animated gradient orbs */}
          <div className="absolute top-32 left-32 w-72 h-72 bg-[#25343F]/25 rounded-full blur-[120px] animate-[pulse_4s_ease-in-out_infinite]"></div>
          <div
            className="absolute bottom-20 right-32 w-96 h-96 bg-[#1E2A33]/20 rounded-full blur-[140px] animate-[pulse_5s_ease-in-out_infinite]delay-700"
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform 
                  -translate-x-1/2 -translate-y-1/2 
                  w-80 h-80 bg-[#EAEFEF]/10 rounded-full blur-[160px] animate-[pulse_6s_ease-in-out_infinite]delay-1000"
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
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                Join Wize-InvoiceAi
              </h2>
              <p className="text-gray-200 text-lg leading-relaxed">
                Precision in invoices. Built for speed and control create your account  
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-center text-3xl font-bold text-[#141C22] mb-2">
              Create Account
            </h1>
            <p className="text-center text-[#BFC9D1]">
              {step === 1 && "Join us today and get started"}
              {step === 2 && "Verify your email address"}
              {step === 3 && "Account created successfully"}
            </p>
          </div>

          {/* Progress Steps */}
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
                className={`w-16 h-1 ${
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
                className={`w-16 h-1 ${
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
            </div>
          </div>

          {/* Sign Up Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 max-h-[calc(100vh-16rem)] overflow-y-auto">
            {/* Step 1: Registration Form */}
            {step === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#141C22] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#EAEFEF] border border-[#BFC9D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141C22] focus:border-transparent text-[#141C22]"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#141C22] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#EAEFEF] border border-[#BFC9D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141C22] focus:border-transparent text-[#141C22]"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#141C22] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#EAEFEF] border border-[#BFC9D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141C22] focus:border-transparent text-[#141C22]"
                    placeholder="+49 1xx xxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#141C22] mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#EAEFEF] border border-[#BFC9D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141C22] focus:border-transparent text-[#141C22]"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#141C22] mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#EAEFEF] border border-[#BFC9D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141C22] focus:border-transparent text-[#141C22]"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#141C22] text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? "Sending OTP..." : "Continue"}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleValidateOtp} className="space-y-5">
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
                    We&apos;ve sent a verification code to
                  </p>
                  <p className="text-[#141C22] font-medium">{formData.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#141C22] mb-2">
                    Verification Code
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
                  {loading ? "Verifying..." : "Verify & Create Account"}
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

            {/* Step 3: Success */}
            {step === 3 && (
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
                  Account Created!
                </h3>
                <p className="text-[#BFC9D1] mb-4">
                  {message || "Redirecting to login..."}
                </p>
              </div>
            )}

            {step === 1 && (
              <div className="mt-6 text-center">
                <p className="text-[#BFC9D1] text-sm">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-[#141C22] font-medium hover:underline"
                  >
                    Sign in
                  </a>
                </p>
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
