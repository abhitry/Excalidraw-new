import { ReactNode } from "react";

export function IconButton({
    icon, onClick, activated
}: {
    icon: ReactNode;
    onClick: () => void;
    activated: boolean;
}) {
    return (
        <div 
            className={`m-2 cursor-pointer rounded-full border p-2 bg-black hover:bg-gray-800 transition-colors ${activated ? "text-red-400 border-red-400" : "text-white border-gray-600"}`} 
            onClick={onClick}
        >
            {icon}
        </div>
    );
}