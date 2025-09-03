"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { useRouter } from "next/navigation";
import { Palette, Wifi, WifiOff } from "lucide-react";

export function RoomCanvas({roomId}: {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [connecting, setConnecting] = useState(true);
    const [connectionError, setConnectionError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            router.push("/signin");
            return;
        }

        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        
        ws.onopen = () => {
            console.log("WebSocket connected");
            setSocket(ws);
            setConnecting(false);
            setConnectionError(false);
            
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }));
        };

        ws.onerror = (error) => {
            console.error("WebSocket connection failed:", error);
            setConnecting(false);
            setConnectionError(true);
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
            setConnecting(false);
            setSocket(null);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
        
    }, [roomId, router]);
   
    if (connecting) {
        return (
            <div className="min-h-screen clean-bg-primary flex items-center justify-center">
                <div className="text-center relative z-10">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-blue-600/30 rounded-xl blur-xl opacity-50 animate-pulse" />
                        <div className="relative w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-xl">
                            <Palette className="w-8 h-8 text-white animate-spin" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Connecting to Canvas</h3>
                    <p className="text-slate-300">Setting up your collaborative workspace...</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
                        <Wifi className="h-4 w-4 animate-pulse" />
                        Establishing real-time connection
                    </div>
                </div>
            </div>
        );
    }

    if (connectionError || !socket) {
        return (
            <div className="min-h-screen clean-bg-primary flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8 relative z-10">
                    <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <WifiOff className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Connection Failed</h3>
                    <p className="text-slate-300 mb-6">
                        Unable to connect to the drawing server. Please check your connection and try again.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
                        >
                            Try Again
                        </button>
                        <button 
                            onClick={() => router.push("/room")} 
                            className="px-6 py-3 border border-slate-600 bg-slate-800 text-white hover:bg-slate-700 font-semibold rounded-lg transition-all duration-200"
                        >
                            Back to Rooms
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <Canvas roomId={roomId} socket={socket} />;
}