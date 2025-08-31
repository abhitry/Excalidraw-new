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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                        <div className="relative w-16 h-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                            <Palette className="w-8 h-8 text-white animate-spin" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Connecting to Canvas</h3>
                    <p className="text-muted-foreground">Setting up your collaborative workspace...</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Wifi className="h-4 w-4 animate-pulse" />
                        Establishing real-time connection
                    </div>
                </div>
            </div>
        );
    }

    if (connectionError || !socket) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <WifiOff className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Connection Failed</h3>
                    <p className="text-muted-foreground mb-6">
                        Unable to connect to the drawing server. Please check your connection and try again.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            Try Again
                        </button>
                        <button 
                            onClick={() => router.push("/room")} 
                            className="px-6 py-3 border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-xl transition-all duration-200"
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