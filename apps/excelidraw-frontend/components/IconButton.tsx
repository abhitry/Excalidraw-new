import { ReactNode } from "react";

export function IconButton({
    icon, onClick, activated, tooltip
}: {
    icon: ReactNode;
    onClick: () => void;
    activated: boolean;
    tooltip?: string;
}) {
    return (
        <div 
            className={`cursor-pointer rounded-xl p-3 transition-all duration-200 hover:scale-105 ${
                activated 
                    ? "bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white shadow-lg" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400"
            }`}
            onClick={onClick}
            title={tooltip}
        >
            {icon}
        </div>
    );
}