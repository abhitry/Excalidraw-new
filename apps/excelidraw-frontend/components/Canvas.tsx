import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon, Type, RotateCcw, ArrowLeft } from "lucide-react";
import { Game } from "@/draw/Game";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export type Tool = "circle" | "rect" | "pencil" | "text";

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle");
    const router = useRouter();

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    useEffect(() => {
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);

            return () => {
                g.destroy();
            };
        }
    }, [canvasRef]);

    const resetCanvas = () => {
        if (game) {
            // Reset zoom and pan
            (game as any).scale = 1;
            (game as any).offsetX = 0;
            (game as any).offsetY = 0;
            (game as any).clearCanvas();
        }
    };

    return (
        <div style={{
            height: "100vh",
            overflow: "hidden",
            position: "relative",
            background: "var(--background)"
        }}>
            <canvas 
                ref={canvasRef} 
                width={window.innerWidth} 
                height={window.innerHeight}
                style={{ 
                    cursor: selectedTool === "pencil" ? "crosshair" : selectedTool === "text" ? "text" : "default",
                    background: "transparent"
                }}
            />
            <Topbar 
                setSelectedTool={setSelectedTool} 
                selectedTool={selectedTool}
                onReset={resetCanvas}
                onBack={() => router.push("/room")}
            />
        </div>
    );
}

function Topbar({selectedTool, setSelectedTool, onReset, onBack}: {
    selectedTool: Tool;
    setSelectedTool: (s: Tool) => void;
    onReset: () => void;
    onBack: () => void;
}) {
    return (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-blue-200 dark:border-blue-800 rounded-xl p-2 shadow-lg">
                <IconButton 
                    onClick={onBack}
                    activated={false}
                    icon={<ArrowLeft />}
                    tooltip="Back to rooms"
                />
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
                <IconButton 
                    onClick={() => {
                        setSelectedTool("pencil");
                    }}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil />}
                    tooltip="Pencil"
                />
                <IconButton 
                    onClick={() => {
                        setSelectedTool("rect");
                    }} 
                    activated={selectedTool === "rect"} 
                    icon={<RectangleHorizontalIcon />} 
                    tooltip="Rectangle"
                />
                <IconButton 
                    onClick={() => {
                        setSelectedTool("circle");
                    }} 
                    activated={selectedTool === "circle"} 
                    icon={<Circle />}
                    tooltip="Circle"
                />
                <IconButton 
                    onClick={() => {
                        setSelectedTool("text");
                    }} 
                    activated={selectedTool === "text"} 
                    icon={<Type />}
                    tooltip="Text"
                />
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
                <IconButton 
                    onClick={onReset}
                    activated={false} 
                    icon={<RotateCcw />}
                    tooltip="Reset view"
                />
            </div>
            <ThemeToggle />
        </div>
    );
}