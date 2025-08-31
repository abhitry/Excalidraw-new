"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";
import { ArrowLeft, Users, Plus, Palette, Sparkles, XCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RoomPage() {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Check authentication and get user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    const authUser = localStorage.getItem("authUser");
    
    if (!token) {
      router.push("/signin");
      return;
    }

    if (authUser) {
      try {
        setUser(JSON.parse(authUser));
      } catch (e) {
        console.error("Failed to parse user data");
        router.push("/signin");
      }
    }
  }, [router]);

  const handleSubmit = async () => {
    setErrors({});
    
    if (!roomName.trim()) {
      setErrors({ roomName: "Please enter a room name" });
      return;
    }

    if (roomName.length < 3) {
      setErrors({ roomName: "Room name must be at least 3 characters" });
      return;
    }

    if (roomName.length > 30) {
      setErrors({ roomName: "Room name must be less than 30 characters" });
      return;
    }

    if (!/^[a-zA-Z0-9\s-_]+$/.test(roomName)) {
      setErrors({ roomName: "Room name can only contain letters, numbers, spaces, hyphens, and underscores" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErrors({ general: "Please sign in first." });
      router.push("/signin");
      return;
    }

    setLoading(true);

    try {
      const roomResponse = await axios.post(`${HTTP_BACKEND}/room`, {
        name: roomName
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const roomId = roomResponse.data.roomId;
      router.push(`/canvas/${roomId}`);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        
        if (errorData?.errors) {
          setErrors(errorData.errors);
        } else if (error.response?.status === 403) {
          setErrors({ general: "Session expired. Please sign in again." });
          localStorage.removeItem("token");
          localStorage.removeItem("authUser");
          router.push("/signin");
        } else if (error.response?.status === 411) {
          setErrors({ roomName: "Room name already exists. Please choose a different name." });
        } else if (error.response?.status === 400) {
          setErrors({ general: errorData?.message || "Invalid input. Please check your room name." });
        } else {
          setErrors({ general: "Failed to create room. Please try again." });
        }
      } else {
        setErrors({ general: "Network error. Please check your connection." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
      
      <div className="w-full max-w-lg relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 rounded-3xl blur-3xl opacity-20" />
          <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-blue-200 dark:border-blue-800 rounded-3xl shadow-2xl p-8">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                <div className="relative w-16 h-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 bg-clip-text text-transparent">
                  Create Your Space
                </span>
              </h2>
              <p className="text-muted-foreground mb-4">
                Welcome back, <span className="font-semibold text-foreground">{user.name}</span>!
              </p>
              <p className="text-sm text-muted-foreground">
                Start a new collaborative drawing session
              </p>
            </div>

            {/* Error Display */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  {errors.general}
                </p>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Room Name
                </label>
                <div className="relative">
                  <Plus className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="e.g., Team Brainstorm, Design Review"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-white dark:bg-gray-800 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.roomName ? 'border-red-300 dark:border-red-700' : 'border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                    disabled={loading}
                    maxLength={30}
                  />
                </div>
                {errors.roomName && (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {errors.roomName}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  3-30 characters • Letters, numbers, spaces, hyphens, and underscores only
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !roomName.trim()}
                  className="group relative w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 hover:from-blue-700 hover:via-indigo-700 hover:to-slate-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl hover:shadow-blue-500/25"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Creating Room...
                      </>
                    ) : (
                      <>
                        Create & Start Drawing
                        <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </form>

            {/* Sign out */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("authUser");
                  router.push("/signin");
                }}
                className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}