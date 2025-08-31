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
                    ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-slate-500 text-white shadow-lg" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
            onClick={onClick}
            title={tooltip}
        >
            {icon}
        </div>
    );
}