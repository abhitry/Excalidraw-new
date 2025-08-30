"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    const prev = localStorage.getItem("authUser");
    const user = prev ? JSON.parse(prev) : {};

    const updatedUser = {
      ...user,
      ...(isSignin ? {} : { name }), // Add name only during signup
      email,
      password,
    };

    localStorage.setItem("authUser", JSON.stringify(updatedUser));

    // Redirect based on step
    router.push(isSignin ? "/room" : "/signin");
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-muted">
      <div className="p-6 m-2 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {isSignin ? "Sign In" : "Sign Up"}
        </h2>

        {!isSignin && (
          <div className="p-2">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>
        )}

        <div className="p-2">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="p-2">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="pt-4">
          <button
            className="w-full bg-primary text-white rounded px-4 py-2 hover:bg-primary/90"
            onClick={handleSubmit}
          >
            {isSignin ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}