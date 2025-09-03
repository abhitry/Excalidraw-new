"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="p-3 rounded-lg border bg-secondary hover:bg-secondary/80 transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <ThemeToggle />
      </div>

      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-destructive rounded-xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The page you’re looking for doesn’t exist or may have been deleted.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;