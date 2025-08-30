import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "pencil";

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
            position: "relative"
        }}>
            <canvas 
                ref={canvasRef} 
                width={window.innerWidth} 
                height={window.innerHeight}
                style={{ cursor: selectedTool === "pencil" ? "crosshair" : "default" }}
            />
            <Topbar 
                setSelectedTool={setSelectedTool} 
                selectedTool={selectedTool}
                onReset={resetCanvas}
            />
        </div>
    );
}

function Topbar({selectedTool, setSelectedTool, onReset}: {
    selectedTool: Tool;
    setSelectedTool: (s: Tool) => void;
    onReset: () => void;
}) {
    return (
        <div style={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1000
        }}>
            <div className="flex gap-2">
                <IconButton 
                    onClick={() => {
                        setSelectedTool("pencil");
                    }}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil />}
                />
                <IconButton 
                    onClick={() => {
                        setSelectedTool("rect");
                    }} 
                    activated={selectedTool === "rect"} 
                    icon={<RectangleHorizontalIcon />} 
                />
                <IconButton 
                    onClick={() => {
                        setSelectedTool("circle");
                    }} 
                    activated={selectedTool === "circle"} 
                    icon={<Circle />}
                />
                <IconButton 
                    onClick={onReset}
                    activated={false} 
                    icon={<RotateCcw />}
                />
            </div>
        </div>
    );
}