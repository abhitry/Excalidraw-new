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

    // Client-side validation
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
          setErrors({ general: errorData?.message || "Please check your input" });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-slate-600/5 dark:from-blue-400/5 dark:via-indigo-400/5 dark:to-slate-400/5" />
      
      <div className="absolute top-6 left-6 flex items-center gap-3 z-50">
        <button
          onClick={() => router.push("/")}
          className="p-3 rounded-xl border border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 shadow-lg hover:shadow-xl"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </button>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 rounded-3xl blur-3xl opacity-20" />
          <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-blue-200 dark:border-blue-800 rounded-3xl shadow-2xl p-8">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                <div className="relative w-16 h-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                  <Palette className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 bg-clip-text text-transparent">
                  {isSignin ? "Welcome Back" : "Join DrawTogether"}
                </span>
              </h2>
              <p className="text-muted-foreground">
                {isSignin
                  ? "Sign in to continue your creative journey"
                  : "Create your account and start collaborating"}
              </p>
            </div>

            {/* Error Display */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{errors.general}</p>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
              {/* Name field - only for signup */}
              {!isSignin && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-white dark:bg-gray-800 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.name ? 'border-red-300 dark:border-red-700' : 'border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                      disabled={loading}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-white dark:bg-gray-800 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-300 dark:border-red-700' : 'border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-14 py-4 border-2 rounded-xl bg-white dark:bg-gray-800 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-300 dark:border-red-700' : 'border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password field - only for signup */}
              {!isSignin && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-12 pr-14 py-4 border-2 rounded-xl bg-white dark:bg-gray-800 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.confirmPassword ? 'border-red-300 dark:border-red-700' : 'border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Password Requirements - only for signup */}
              {!isSignin && password && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p className="text-sm font-semibold text-foreground mb-3">Password Requirements:</p>
                  <div className="space-y-2 text-sm">
                    <div className={`flex items-center gap-2 ${passwordValidation.length ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                      {passwordValidation.length ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      At least 8 characters
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.uppercase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                      {passwordValidation.uppercase ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      Contains uppercase letter
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.lowercase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                      {passwordValidation.lowercase ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      Contains lowercase letter
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.number ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                      {passwordValidation.number ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      Contains number
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.match ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
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
                  className="group relative w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 hover:from-blue-700 hover:via-indigo-700 hover:to-slate-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl hover:shadow-blue-500/25"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </form>

            {/* Footer link */}
            <div className="mt-8 text-center">
              {isSignin ? (
                <p className="text-sm text-muted-foreground">
                  Dont have an account?{" "}
                  <button
                    onClick={() => router.push("/signup")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    Create one now
                  </button>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={() => router.push("/signin")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
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