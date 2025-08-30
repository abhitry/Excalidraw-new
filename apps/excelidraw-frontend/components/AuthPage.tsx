"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async () => {
    setErrors({});

    if (!email.trim() || !password.trim()) {
      setErrors({ general: "Please fill in all fields" });
      return;
    }

    if (!isSignin && !name.trim()) {
      setErrors({ name: "Please enter your name" });
      return;
    }

    setLoading(true);

    try {
      if (isSignin) {
        const response = await axios.post(`${HTTP_BACKEND}/signin`, {
          username: email,
          password: password,
        });

        const token = response.data.token;
        localStorage.setItem("token", token);

        localStorage.setItem(
          "authUser",
          JSON.stringify({
            email,
            name: name || email.split("@")[0],
          })
        );

        router.push("/room");
      } else {
        await axios.post(`${HTTP_BACKEND}/signup`, {
          username: email,
          password: password,
          name: name,
        });

        localStorage.setItem(
          "authUser",
          JSON.stringify({
            email,
            password,
            name,
          })
        );

        router.push("/signin");
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        if (
          error.response?.status === 411 ||
          errorMessage?.includes("already exists")
        ) {
          setErrors({ email: "User already exists with this email" });
        } else if (
          error.response?.status === 403 ||
          errorMessage?.includes("Not authorized")
        ) {
          setErrors({ general: "Invalid email or password" });
        } else if (errorMessage?.includes("Incorrect inputs")) {
          setErrors({ general: "Please check your input format" });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-lg border border-border bg-background/80 backdrop-blur-sm hover:bg-accent transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-blue-200 dark:border-blue-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isSignin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isSignin
                ? "Sign in to start drawing"
                : "Join our collaborative drawing platform"}
            </p>
          </div>

          {/* Full name field only on signup */}
          {!isSignin && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loading}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
            {!isSignin && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Password must be at least 8 characters with uppercase,
                lowercase, and number
              </p>
            )}
          </div>

          {/* Submit button */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading
                ? isSignin
                  ? "Signing In..."
                  : "Signing Up..."
                : isSignin
                ? "Sign In"
                : "Sign Up"}
            </button>
          </div>

          {/* Footer link */}
          <div className="mt-6 text-center">
            {isSignin ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dont have an account?{" "}
                <button
                  onClick={() => router.push("/signup")}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/signin")}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}