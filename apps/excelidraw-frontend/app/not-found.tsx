"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col sm:flex-row items-center justify-center p-4 bg-background text-foreground relative">
      {/* 🔥 Added flex-col sm:flex-row for responsive layout */}
      
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-3">
        {/* 🔥 Adjusted positioning for mobile and laptop */}
        <button
          onClick={() => router.push("/")}
          className="p-2 sm:p-3 rounded-lg border bg-secondary hover:bg-secondary/80 transition"
        >
          {/* 🔥 Adjusted padding for responsive button */}
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          {/* 🔥 Scaled icon for mobile/laptop */}
        </button>
        <ThemeToggle />
      </div>

      <div className="text-center max-w-xs sm:max-w-md lg:max-w-lg mx-auto">
        {/* 🔥 Responsive max width for mobile, tablet, and laptop */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-destructive rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
          {/* 🔥 Adjusted size and margin for responsiveness */}
          <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          {/* 🔥 Icon scaled for mobile/laptop */}
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Page Not Found
        </h1>
        {/* 🔥 Responsive font sizes */}
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
          The page you’re looking for doesn’t exist or may have been deleted.
        </p>
        {/* 🔥 Adjusted text size and margin */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
          {/* 🔥 Stack buttons on mobile, row on laptop */}
          <button
            onClick={() => router.push("/")}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-foreground rounded-lg font-semibold w-full sm:w-auto"
          >
            {/* 🔥 Full width on mobile, auto width on laptop */}
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;