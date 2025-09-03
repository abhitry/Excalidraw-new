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
                    ? "bg-white/30 backdrop-blur-sm text-white shadow-lg border border-white/40" 
                    : "bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white border border-white/20 hover:border-white/30"
            }`}
            onClick={onClick}
            title={tooltip}
        >
            {icon}
        </div>
    );
}