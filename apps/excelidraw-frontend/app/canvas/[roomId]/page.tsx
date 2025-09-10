import { RoomCanvas } from "@/components/RoomCanvas";
import { notFound } from "next/navigation";
import { HTTP_BACKEND } from "@/config";

async function getRoomInfo(roomSlug: string) {
  try {
    const response = await fetch(`${HTTP_BACKEND}/room/${roomSlug}`, {
      cache: "no-store",
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

export default async function CanvasPage({ 
  params 
}: { 
  params: Promise<{ roomId: string }> 
}) {
  const { roomId } = await params;
  const roomSlug = roomId;

  const roomInfo = await getRoomInfo(roomSlug);
  if (!roomInfo) {
    notFound();
  }

  return <RoomCanvas roomId={roomInfo.id.toString()} roomInfo={roomInfo} />;
}