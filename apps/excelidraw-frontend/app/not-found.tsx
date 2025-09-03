"use client";

import { ArrowLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function NotFound() {
    const router = useRouter();

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
                    The room you're looking for doesn't exist or may have been deleted.
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