"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";
import { ArrowLeft, Users, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RoomPage() {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const router = useRouter();

  const handleSubmit = async () => {
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
      // Create room
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
        const errorMessage = error.response?.data?.message;
        if (error.response?.status === 403) {
          setErrors({ general: "Session expired. Please sign in again." });
          localStorage.removeItem("token");
          router.push("/signin");
        } else if (error.response?.status === 411 || errorMessage?.includes("already exists")) {
          setErrors({ roomName: "Room name already exists. Please choose a different name." });
        } else if (errorMessage?.includes("Incorrect inputs")) {
          setErrors({ roomName: "Invalid room name format" });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <button
          onClick={() => router.push("/signin")}
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
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Room</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Start a new collaborative drawing session
            </p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

        <h2 className="text-xl font-semibold mb-4 text-center">Create Room</h2>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Room Name
              </label>
              <div className="relative">
                <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
                placeholder="Enter room name (e.g., Team Brainstorm)"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={loading}
          />
              </div>
              {errors.roomName && (
                <p className="text-red-500 text-sm">{errors.roomName}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Room name must be 3-30 characters, letters, numbers, spaces, hyphens, and underscores only
              </p>
        </div>

            <div className="pt-2">
          <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create and Start Drawing"}
          </button>
            
          </div>
        </form>

          <div className="mt-6 text-center">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("authUser");
              router.push("/signin");
            }}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Sign out
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}