"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Palette, CheckCircle, XCircle } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Password validation
  const passwordValidation = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    match: !isSignin ? password === confirmPassword && password.length > 0 : true
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleSubmit = async () => {
    setErrors({});
    
    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!password.trim()) {
      setErrors({ password: "Password is required" });
      return;
    }

    if (!isSignin) {
      if (!name.trim()) {
        setErrors({ name: "Name is required" });
        return;
      }
      
      if (!confirmPassword.trim()) {
        setErrors({ confirmPassword: "Please confirm your password" });
        return;
      }

      if (!isPasswordValid) {
        setErrors({ password: "Please meet all password requirements" });
        return;
      }
    }

    // const token = localStorage.getItem("token");
    // if (!token) {
    //   setErrors({ general: "Please sign in first." });
    //   router.push("/signin");
    //   return;
    // }

    setLoading(true);

    try {
      if (isSignin) {
        const response = await axios.post(`${HTTP_BACKEND}/signin`, {
          email: email,
          password: password,
        });

        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("authUser", JSON.stringify(user));

        router.push("/room");
      } else {
        const response = await axios.post(`${HTTP_BACKEND}/signup`, {
          email: email,
          password: password,
          name: name,
        });

        const { token, userId } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("authUser", JSON.stringify({
          id: userId,
          email,
          name,
        }));

        // Direct login after signup
        router.push("/room");
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        
        if (errorData?.errors) {
          // Handle validation errors from backend
          setErrors(errorData.errors);
        } else if (error.response?.status === 411) {
          setErrors({ email: "User already exists with this email" });
        } else if (error.response?.status === 403) {
          setErrors({ general: "Invalid email or password" });
        } else if (error.response?.status === 400) {
          setErrors({ general: errorData?.message || "Invalid input. Please check your room name." });
        } else {
          setErrors({ general: "Authentication failed. Please try again." });
        }
      } else {
        setErrors({ general: "Network error. Please check your connection." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen clean-bg-primary flex items-center justify-center p-4">
      
      <div className="absolute top-6 left-6 flex items-center gap-3 z-50">
        <button
          onClick={() => router.push("/")}
          className="p-3 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 transition-all duration-200 shadow-lg"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-slate-300" />
        </button>
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-600/10 rounded-2xl blur-2xl opacity-30" />
          <div className="relative bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl p-8">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-600/30 rounded-xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-xl">
                  <Palette className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-white">
                {isSignin ? "Welcome Back" : "Join DrawTogether"}
              </h2>
              <p className="text-white/80">
                {isSignin
                  ? "Sign in to continue your creative journey"
                  : "Create your account and start collaborating"}
              </p>
            </div>

            {/* Error Display */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm font-medium flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  {errors.general}
                </p>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
              {/* Name field - only for signup */}
              {!isSignin && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 border rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.name ? 'border-red-500' : 'border-slate-600 hover:border-slate-500'
                      }`}
                      disabled={loading}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-300 text-sm font-medium flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.email ? 'border-red-500' : 'border-slate-600 hover:border-slate-500'
                    }`}
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-300 text-sm font-medium flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-14 py-4 border rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.password ? 'border-red-500' : 'border-slate-600 hover:border-slate-500'
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-300 text-sm font-medium flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password field - only for signup */}
              {!isSignin && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-12 pr-14 py-4 border rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-slate-600 hover:border-slate-500'
                      }`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-300 text-sm font-medium flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Password Requirements - only for signup */}
              {!isSignin && password && (
                <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
                  <p className="text-sm font-semibold text-white mb-3">Password Requirements:</p>
                  <div className="space-y-2 text-sm">
                    <div className={`flex items-center gap-2 ${passwordValidation.length ? 'text-green-300' : 'text-white/60'}`}>
                      {passwordValidation.length ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      At least 8 characters
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.uppercase ? 'text-green-300' : 'text-white/60'}`}>
                      {passwordValidation.uppercase ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      Contains uppercase letter
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.lowercase ? 'text-green-300' : 'text-white/60'}`}>
                      {passwordValidation.lowercase ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      Contains lowercase letter
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.number ? 'text-green-300' : 'text-white/60'}`}>
                      {passwordValidation.number ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      Contains number
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.match ? 'text-green-300' : 'text-white/60'}`}>
                      {passwordValidation.match ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      Passwords match
                    </div>
                  </div>
                </div>
              )}

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || (!isSignin && !isPasswordValid)}
                  className="group relative w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        {isSignin ? "Signing In..." : "Creating Account..."}
                      </>
                    ) : (
                      <>
                        {isSignin ? "Sign In" : "Create Account"}
                        <Palette className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>

            {/* Footer link */}
            <div className="mt-8 text-center">
              {isSignin ? (
                <p className="text-sm text-slate-400">
                  Dont have an account?{" "}
                  <button
                    onClick={() => router.push("/signup")}
                    className="text-blue-400 font-semibold hover:text-blue-300 transition-all duration-200"
                  >
                    Create one now
                  </button>
                </p>
              ) : (
                <p className="text-sm text-slate-400">
                  Already have an account?{" "}
                  <button
                    onClick={() => router.push("/signin")}
                    className="text-blue-400 font-semibold hover:text-blue-300 transition-all duration-200"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}