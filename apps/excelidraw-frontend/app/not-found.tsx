"use client";

import { ArrowLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function NotFound() {
    const router = useRouter();

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
                    The room you're looking for doesn't exist or may have been deleted.
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