"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Shield,
  TrendingUp,
  FileText,
  Clock,
  Building2,
  ArrowRight,
  Menu,
  X,
  Upload,
  CheckCircle2,
  Sparkles,
  Star,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Processing",
      description: "AI-powered invoice extraction in seconds, not hours",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Bank-level encryption for all your financial data",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Get insights into your spending patterns instantly",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: FileText,
      title: "Multi-Format Support",
      description: "Process PDFs, images, and scanned documents",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: Clock,
      title: "Save 10+ Hours Weekly",
      description: "Automate manual data entry and reduce errors",
      gradient: "from-rose-500 to-red-600",
    },
    {
      icon: Building2,
      title: "Cost Center Management",
      description: "Organize expenses by department or project",
      gradient: "from-cyan-500 to-blue-600",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Invoices Processed" },
    { value: "500+", label: "Active Users" },
    { value: "99.9%", label: "Accuracy Rate" },
    { value: "24/7", label: "Support" },
  ];

  const testimonials = [
    {
      quote: "Wize-InvoiceAI has transformed how we handle invoices. What used to take hours now takes minutes.",
      author: "Sarah Chen",
      role: "CFO at TechCorp",
      rating: 5,
    },
    {
      quote: "The AI accuracy is incredible. It's like having a dedicated finance assistant working 24/7.",
      author: "Michael Rodriguez",
      role: "Accounting Manager",
      rating: 5,
    },
    {
      quote: "Best investment we've made for our accounting department. ROI was immediate.",
      author: "Emma Thompson",
      role: "Finance Director",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-b border-gray-200/50 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
              <div className="w-10 h-10 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Wize-InvoiceAI
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                Testimonials
              </a>
              <button
                onClick={() => router.push("/login")}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="px-6 py-2.5 bg-linear-to-r from-gray-900 to-gray-800 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all shadow-md"
              >
                Get Started Free
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-6 border-t border-gray-200/50">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-2 py-2 hover:bg-gray-50 rounded-lg transition-all">Features</a>
                <a href="#how-it-works" className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-2 py-2 hover:bg-gray-50 rounded-lg transition-all">How It Works</a>
                <a href="#testimonials" className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-2 py-2 hover:bg-gray-50 rounded-lg transition-all">Testimonials</a>
                <button
                  onClick={() => router.push("/login")}
                  className="text-left text-sm font-semibold text-gray-700 px-2 py-2 hover:bg-gray-50 rounded-lg transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/signup")}
                  className="px-6 py-3 bg-linear-to-r from-gray-900 to-gray-800 text-white rounded-xl text-sm font-semibold shadow-lg"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-amber-100 to-pink-100 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold mb-8 shadow-lg">
              <Sparkles size={16} className="text-amber-400" />
              <span>Trusted by 500+ businesses worldwide</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              Invoice Management
              <span className="block mt-2 bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed font-light">
              Transform hours of manual work into seconds with AI-powered invoice processing.
              <span className="block mt-2">Less stress, more progress.</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => router.push("/signup")}
                className="group px-8 py-4 bg-linear-to-r from-gray-900 to-gray-800 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all shadow-xl flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/invoice-generator")}
                className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-900 hover:shadow-lg transition-all"
              >
                Try Invoice Generator
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-linear-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-2xl border border-gray-200/50">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-linear-to-r from-gray-200 to-gray-100 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-linear-to-r from-gray-200 to-gray-100 rounded-lg w-1/2"></div>
                  <div className="h-4 bg-linear-to-r from-gray-200 to-gray-100 rounded-lg w-5/6"></div>
                  <div className="h-48 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 to-purple-600/10"></div>
                    <Upload className="w-16 h-16 text-white/50 relative z-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-linear-to-b from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="text-5xl font-bold bg-linear-to-br from-white to-gray-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold text-gray-700 mb-6">
              POWERFUL FEATURES
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Everything you need to manage invoices
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your invoice workflow and save you time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`w-14 h-14 bg-linear-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all relative z-10`}>
                  <feature.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed relative z-10">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 bg-linear-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold text-gray-700 mb-6">
              SIMPLE PROCESS
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">How it works</h2>
            <p className="text-xl text-gray-600">Get started in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-1 bg-linear-to-r from-gray-300 via-gray-400 to-gray-300"></div>

            <div className="text-center relative">
              <div className="w-20 h-20 bg-linear-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6 shadow-xl relative z-10">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Upload Invoice</h3>
              <p className="text-gray-600 leading-relaxed">
                Drag and drop your invoice or take a photo. We support all formats.
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-20 h-20 bg-linear-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6 shadow-xl relative z-10">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Processing</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI extracts all data automatically with 99.9% accuracy in seconds.
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-20 h-20 bg-linear-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6 shadow-xl relative z-10">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Get Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                View analytics, manage expenses, and make data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-28 px-4 sm:px-6 lg:px-8 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-semibold text-white/90 mb-6">
              LOVED BY TEAMS
            </div>
            <h2 className="text-5xl font-bold text-white mb-6">
              What our customers say
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands of satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6 italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div>
                  <div className="font-bold text-white">{testimonial.author}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Ready to transform your invoice management?
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Join thousands of businesses already saving time and money with Wize-InvoiceAI.
            <span className="block mt-2">Start your free trial today, no credit card required.</span>
          </p>
          <button
            onClick={() => router.push("/signup")}
            className="group px-10 py-5 bg-linear-to-r from-gray-900 to-gray-800 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
          >
            Start Free Trial
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-6 text-sm text-gray-500">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-linear-to-b from-gray-900 to-black text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-linear-to-br from-white to-gray-300 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-5 h-5 text-gray-900" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold">Wize-InvoiceAI</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Invoice management simplified with AI. Transform your workflow today.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-white">Product</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/invoice-generator" className="hover:text-white transition-colors">Invoice Generator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-white">Company</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-white">Support</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© 2026 Wize-InvoiceAI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}