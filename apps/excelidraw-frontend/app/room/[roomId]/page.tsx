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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
                <div className="absolute top-6 left-6 flex items-center gap-3 z-50">
                    <button
                        onClick={() => router.push("/")}
                        className="p-3 rounded-xl border border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 shadow-lg hover:shadow-xl"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </button>
                    <ThemeToggle />
                </div>

                <div className="text-center max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Room Not Found</h1>
                    <p className="text-muted-foreground mb-6">
                        {error || "The room you're looking for doesn't exist or may have been deleted."}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={() => router.push("/room")} 
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            Create New Room
                        </button>
                        <button 
                            onClick={() => router.push("/")} 
                            className="px-6 py-3 border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-xl transition-all duration-200"
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
            <div className="absolute top-6 left-6 flex items-center gap-3 z-50">
                <button
                    onClick={() => router.push("/")}
                    className="p-3 rounded-xl border border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 shadow-lg hover:shadow-xl"
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </button>
                <ThemeToggle />
            </div>

            <div className="w-full max-w-lg relative z-10">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 rounded-3xl blur-3xl opacity-20" />
                    <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-blue-200 dark:border-blue-800 rounded-3xl shadow-2xl p-8">
                        
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                                <div className="relative w-16 h-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 bg-clip-text text-transparent">
                                    Join Room
                                </span>
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                You've been invited to collaborate!
                            </p>
                        </div>

                        {/* Room Info */}
                        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
                            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                Room Details
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                        <Users className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{roomInfo.name}</p>
                                        <p className="text-muted-foreground">Room Name</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                        <User className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{roomInfo.admin.name}</p>
                                        <p className="text-muted-foreground">Created by</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">
                                            {new Date(roomInfo.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-muted-foreground">Created on</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {user && (
                            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                                <p className="text-sm text-green-700 dark:text-green-400">
                                    <span className="font-semibold">Ready to join as:</span> {user.name}
                                </p>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                onClick={joinRoom}
                                className="group relative w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 hover:from-blue-700 hover:via-indigo-700 hover:to-slate-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-2xl hover:shadow-blue-500/25"
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    Join & Start Collaborating
                                    <Users className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
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
                                className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
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