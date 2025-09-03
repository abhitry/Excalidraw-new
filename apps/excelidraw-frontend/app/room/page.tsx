"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";
import { ArrowLeft, Users, Plus, Palette, Sparkles, XCircle, Lock, Key } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RoomPage() {
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [isJoining, setIsJoining] = useState(false);
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

  const handleCreateRoom = async () => {
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

    if (roomPassword && roomPassword.length < 4) {
      setErrors({ roomPassword: "Password must be at least 4 characters" });
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
        name: roomName,
        password: roomPassword || undefined
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

  const handleJoinRoom = async () => {
    setErrors({});
    
    if (!roomName.trim()) {
      setErrors({ roomName: "Please enter a room name" });
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
      const joinResponse = await axios.post(`${HTTP_BACKEND}/room/join`, {
        name: roomName,
        password: roomPassword || undefined
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const roomId = joinResponse.data.roomId;
      router.push(`/canvas/${roomId}`);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        
        if (errorData?.errors) {
          setErrors(errorData.errors);
        } else if (error.response?.status === 404) {
          setErrors({ roomName: "Room not found. Please check the room name." });
        } else if (error.response?.status === 403) {
          setErrors({ roomPassword: "Incorrect room password." });
        } else if (error.response?.status === 400) {
          setErrors({ general: errorData?.message || "Invalid input." });
        } else {
          setErrors({ general: "Failed to join room. Please try again." });
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
      <div className="min-h-screen animated-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4" />
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
      
      <div className="absolute top-6 left-6 flex items-center gap-3 z-50">
        <button
          onClick={() => router.push("/")}
          className="p-3 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 shadow-lg hover:shadow-xl"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-lg relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-3xl opacity-30" />
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl opacity-50 animate-pulse" />
                <div className="relative w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto shadow-2xl border border-white/30">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-white">
                {isJoining ? "Join Workspace" : "Create Your Space"}
              </h2>
              <p className="text-white/80 mb-4">
                Welcome back, <span className="font-semibold text-white">{user.name}</span>!
              </p>
              <p className="text-sm text-white/70">
                {isJoining ? "Enter room details to join" : "Start a new collaborative drawing session"}
              </p>
            </div>

            {/* Toggle between Create and Join */}
            <div className="flex mb-6 bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
              <button
                onClick={() => setIsJoining(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  !isJoining 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Create Room
              </button>
              <button
                onClick={() => setIsJoining(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  isJoining 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Join Room
              </button>
            </div>

            {/* Error Display */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm">
                <p className="text-red-200 text-sm font-medium flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  {errors.general}
                </p>
              </div>
            )}

            <form onSubmit={(e) => { 
              e.preventDefault(); 
              isJoining ? handleJoinRoom() : handleCreateRoom(); 
            }} className="space-y-6">
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  Room Name
                </label>
                <div className="relative">
                  <Plus className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="e.g., Team Brainstorm, Design Review"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 ${
                      errors.roomName ? 'border-red-400/50' : 'border-white/30 hover:border-white/50'
                    }`}
                    disabled={loading}
                    maxLength={30}
                  />
                </div>
                {errors.roomName && (
                  <p className="text-red-200 text-sm font-medium flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {errors.roomName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  Room Password {!isJoining && <span className="text-white/60">(Optional)</span>}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <input
                    type="password"
                    placeholder={isJoining ? "Enter room password" : "Set room password (optional)"}
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 ${
                      errors.roomPassword ? 'border-red-400/50' : 'border-white/30 hover:border-white/50'
                    }`}
                    disabled={loading}
                    maxLength={20}
                  />
                </div>
                {errors.roomPassword && (
                  <p className="text-red-200 text-sm font-medium flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {errors.roomPassword}
                  </p>
                )}
                <p className="text-xs text-white/60">
                  {isJoining 
                    ? "Enter the password provided by the room creator"
                    : "Set a password to make your room private (4-20 characters)"
                  }
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !roomName.trim()}
                  className="group relative w-full h-14 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl hover:shadow-white/25 border border-white/30"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        {isJoining ? "Joining Room..." : "Creating Room..."}
                      </>
                    ) : (
                      <>
                        {isJoining ? (
                          <>
                            Join Room
                            <Key className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                          </>
                        ) : (
                          <>
                            Create & Start Drawing
                            <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                          </>
                        )}
                      </>
                    )}
                  </span>
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
                className="text-sm text-white/70 hover:text-white transition-colors font-medium"
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