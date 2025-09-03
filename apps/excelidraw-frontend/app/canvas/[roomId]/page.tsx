import { RoomCanvas } from "@/components/RoomCanvas";

import { notFound } from "next/navigation";
import { HTTP_BACKEND } from "@/config";

async function getRoomInfo(roomId: string) {
    try {
        const response = await fetch(`${HTTP_BACKEND}/room/${roomId}/info`, {
            cache: 'no-store'
        });
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        return data.room;
    } catch (error) {
        console.error("Failed to fetch room info:", error);
        return null;
    }
}

export default async function CanvasPage({ params }: {
    params: {
        roomId: string
    }
}) {
    const roomId = (await params).roomId;
    
    // Validate that the room exists
    const roomInfo = await getRoomInfo(roomId);
    
    if (!roomInfo) {
        notFound();
    }

    return <RoomCanvas roomId={roomId} roomInfo={roomInfo} />
   
}