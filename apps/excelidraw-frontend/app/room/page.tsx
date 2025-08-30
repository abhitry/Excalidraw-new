"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";

export default function RoomPage() {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!roomName.trim()) {
      alert("Please enter a room name");
      return;
    }

    const userData = localStorage.getItem("authUser");
    if (!userData) {
      alert("User data not found. Please sign in again.");
      router.push("/signin");
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(userData);
      
      // First signup the user
      const signupResponse = await axios.post(`${HTTP_BACKEND}/signup`, {
        username: user.email,
        password: user.password,
        name: user.name
      });
      console.log(signupResponse.data.userId);
      // Then signin to get token
      const signinResponse = await axios.post(`${HTTP_BACKEND}/signin`, {
        username: user.email,
        password: user.password
      });

      const token = signinResponse.data.token;
      localStorage.setItem("token", token);

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
      if (axios.isAxiosError(error) && error.response?.status === 411) {
        // User already exists, try to signin
        try {
          const user = JSON.parse(userData);
          const signinResponse = await axios.post(`${HTTP_BACKEND}/signin`, {
            username: user.email,
            password: user.password
          });

          const token = signinResponse.data.token;
          localStorage.setItem("token", token);

          // Create room
          const roomResponse = await axios.post(`${HTTP_BACKEND}/room`, {
            name: roomName
          }, {
            headers: {
              'Authorization': token
            }
          });

          const roomId = roomResponse.data.roomId;
          router.push(`/canvas/${roomId}`);
        } catch (signinError) {
          alert("Failed to sign in or create room"+signinError);
        }
      } else {
        alert("Failed to create user or room");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-muted">
      <div className="p-6 m-2 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Create Room</h2>

        <div className="p-2">
          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="pt-4">
          <button
            className="w-full bg-primary text-white rounded px-4 py-2 hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create and Start Drawing"}
          </button>
        </div>
      </div>
    </div>
  );
}