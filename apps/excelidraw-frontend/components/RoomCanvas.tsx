"use client";

import { WS_URL } from "@/config";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}: {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [connecting, setConnecting] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            setConnecting(false);
            return;
        }

        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        
        ws.onopen = () => {
            console.log("WebSocket connected");
            setSocket(ws);
            setConnecting(false);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            console.log(data);
            ws.send(data);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            setConnecting(false);
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
            setConnecting(false);
        };

        return () => {
            ws.close();
        };
        
    }, [roomId]);
   
    if (connecting) {
        return <div>
            Connecting to server....
        </div>;
    }

    if (!socket) {
        return <div>
            Failed to connect to server. Please refresh the page.
        </div>;
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>;
}