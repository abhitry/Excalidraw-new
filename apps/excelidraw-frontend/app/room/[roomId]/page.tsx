"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";
import { ArrowLeft, Users, AlertCircle, Calendar, User } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RoomCanvas } from "@/components/RoomCanvas";

export default function JoinRoomPage({ params }: {
    params: {
        roomId: string
    }
}) {
    const [roomId, setRoomId] = useState<string>("");
    const [roomInfo, setRoomInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [user, setUser] = useState<any>(null);
    const [joining, setJoining] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setRoomId(resolvedParams.roomId);
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
        if (!roomId) return;

        const fetchRoomInfo = async () => {
            try {
                const response = await fetch(`${HTTP_BACKEND}/room/${roomId}/info`);
                
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
    }, [roomId]);

    const joinRoom = () => {
        setJoining(true);
        // The RoomCanvas component will handle the actual joining
    };

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
                <div className="absolute top-6 left-6 flex items-center gap-3 z-50">
                    <button
                        onClick={() => router.push("/")}
                        className="p-3 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 transition-all duration-200 shadow-lg"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-5 w-5 text-slate-300" />
                    </button>
                    <ThemeToggle />
                </div>

                <div className="text-center max-w-md mx-auto">
                    <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Room Not Found</h1>
                    <p className="text-slate-300 mb-6">
                        {error || "The room you're looking for doesn't exist or may have been deleted."}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={() => router.push("/room")} 
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
                        >
                            Create New Room
                        </button>
                        <button 
                            onClick={() => router.push("/")} 
                            className="px-6 py-3 border border-slate-600 bg-slate-800 text-white hover:bg-slate-700 font-semibold rounded-lg transition-all duration-200"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (joining) {
        return <RoomCanvas roomId={roomId} roomInfo={roomInfo} />;
    }

    return (
        <div className="min-h-screen clean-bg-primary flex items-center justify-center p-4">
            <div className="absolute top-6 left-6 flex items-center gap-3 z-50">
                <button
                    onClick={() => router.push("/")}
                    className="p-3 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 transition-all duration-200 shadow-lg"
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-5 w-5 text-slate-300" />
                </button>
                <ThemeToggle />
            </div>

            <div className="w-full max-w-lg relative z-10">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-600/10 rounded-2xl blur-2xl opacity-30" />
                    <div className="relative bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl p-8">
                        
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-blue-600/30 rounded-xl blur-xl opacity-30 animate-pulse" />
                                <div className="relative w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-xl">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">
                                <span className="text-white">
                                    Join Room
                                </span>
                            </h2>
                            <p className="text-slate-300 mb-4">
                                You've been invited to collaborate!
                            </p>
                        </div>

                        {/* Room Info */}
                        <div className="bg-slate-700 border border-slate-600 rounded-lg p-6 mb-6">
                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                Room Details
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <Users className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{roomInfo.name}</p>
                                        <p className="text-slate-400">Room Name</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{roomInfo.admin.name}</p>
                                        <p className="text-slate-400">Created by</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <Calendar className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">
                                            {new Date(roomInfo.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-slate-400">Created on</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {user && (
                            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-6">
                                <p className="text-sm text-green-300">
                                    <span className="font-semibold">Ready to join as:</span> {user.name}
                                </p>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                onClick={joinRoom}
                                className="group relative w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    Join & Start Collaborating
                                    <Users className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                </span>
                            </button>
                        </div>

                        {/* Sign out */}
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("authUser");
                                    router.push("/signin");
                                }}
                                className="text-sm text-slate-400 hover:text-blue-400 transition-colors font-medium"
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