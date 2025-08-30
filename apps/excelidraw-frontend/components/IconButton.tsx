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
            className={`cursor-pointer rounded-lg p-2 transition-all duration-200 hover:scale-105 ${
                activated 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            onClick={onClick}
            title={tooltip}
        >
            {icon}
        </div>
    );
}