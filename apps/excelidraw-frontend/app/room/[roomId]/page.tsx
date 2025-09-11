"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RoomCanvas } from "@/components/RoomCanvas";

export default function JoinRoomPage({ 
    params 
}: {
    params: Promise<{ roomId: string }>
}) {
    const [roomId, setRoomId] = useState<string>("");
    const [roomInfo, setRoomInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setRoomId(resolvedParams.roomId); // This is actually the room slug
        };
        resolveParams();
    }, [params]);

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

    useEffect(() => {
        if (!roomId) return; // roomId is actually the slug here

        const fetchRoomInfo = async () => {
            try {
                const response = await fetch(`${HTTP_BACKEND}/room/${roomId}`);
                
                if (!response.ok) {
                    setError("Room not found");
                    setLoading(false);
                    return;
                }
                
                const data = await response.json();
                setRoomInfo(data.room);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch room info:", error);
                setError("Failed to load room information");
                setLoading(false);
            }
        };

        fetchRoomInfo();
    }, [roomId]); // roomId is actually the slug

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading room information...</p>
                </div>
            </div>
        );
    }

    if (error || !roomInfo) {
        return (
            <div className="min-h-screen clean-bg-primary flex items-center justify-center p-4">
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-3 z-50">
                    <button
                        onClick={() => router.push("/")}
                        className="p-2 sm:p-3 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 transition-all duration-200 shadow-lg"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300" />
                    </button>
                    <ThemeToggle />
                </div>

                <div className="text-center max-w-xs sm:max-w-md mx-auto px-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                        <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Room Not Found</h1>
                    <p className="text-sm sm:text-base text-slate-300 mb-4 sm:mb-6">
                        {error || "The room you're looking for doesn't exist or may have been deleted."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button 
                            onClick={() => router.push("/room")} 
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg text-sm sm:text-base"
                        >
                            Create New Room
                        </button>
                        <button 
                            onClick={() => router.push("/")} 
                            className="px-4 sm:px-6 py-2 sm:py-3 border border-slate-600 bg-slate-800 text-white hover:bg-slate-700 font-semibold rounded-lg transition-all duration-200 text-sm sm:text-base"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Directly render the canvas without the join room intermediate page
    return <RoomCanvas roomId={roomInfo.id.toString()} roomInfo={roomInfo} />;
}