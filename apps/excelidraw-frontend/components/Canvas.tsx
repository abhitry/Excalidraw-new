import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon, Type, RotateCcw, ArrowLeft, Palette, Users } from "lucide-react";
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
    const [selectedTool, setSelectedTool] = useState<Tool>("pencil");
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const authUser = localStorage.getItem("authUser");
        if (authUser) {
            try {
                setUser(JSON.parse(authUser));
            } catch (e) {
                console.error("Failed to parse user data");
            }
        }
    }, []);

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
    }, [canvasRef, roomId, socket]);

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
        <div className="h-screen w-screen overflow-hidden relative bg-gradient-to-br from-blue-50/30 via-indigo-50/30 to-slate-100/30 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
            <canvas 
                ref={canvasRef} 
                className={`absolute inset-0 ${
                    selectedTool === "pencil" ? "cursor-crosshair" : 
                    selectedTool === "text" ? "cursor-text" : 
                    "cursor-default"
                }`}
            />
            <Topbar 
                setSelectedTool={setSelectedTool} 
                selectedTool={selectedTool}
                onReset={resetCanvas}
                onBack={() => router.push("/room")}
                user={user}
                roomId={roomId}
            />
        </div>
    );
}

function Topbar({
    selectedTool, 
    setSelectedTool, 
    onReset, 
    onBack, 
    user, 
    roomId
}: {
    selectedTool: Tool;
    setSelectedTool: (s: Tool) => void;
    onReset: () => void;
    onBack: () => void;
    user: any;
    roomId: string;
}) {
    return (
        <>
            {/* Main Toolbar */}
            <div className="fixed top-6 left-6 z-50 flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-blue-200 dark:border-blue-800 rounded-2xl p-3 shadow-2xl">
                    <IconButton 
                        onClick={onBack}
                        activated={false}
                        icon={<ArrowLeft className="h-5 w-5" />}
                        tooltip="Back to rooms"
                    />
                    <div className="w-px h-8 bg-blue-200 dark:bg-blue-700" />
                    <IconButton 
                        onClick={() => setSelectedTool("pencil")}
                        activated={selectedTool === "pencil"}
                        icon={<Pencil className="h-5 w-5" />}
                        tooltip="Pencil Tool"
                    />
                    <IconButton 
                        onClick={() => setSelectedTool("rect")} 
                        activated={selectedTool === "rect"} 
                        icon={<RectangleHorizontalIcon className="h-5 w-5" />} 
                        tooltip="Rectangle Tool"
                    />
                    <IconButton 
                        onClick={() => setSelectedTool("circle")} 
                        activated={selectedTool === "circle"} 
                        icon={<Circle className="h-5 w-5" />}
                        tooltip="Circle Tool"
                    />
                    <IconButton 
                        onClick={() => setSelectedTool("text")} 
                        activated={selectedTool === "text"} 
                        icon={<Type className="h-5 w-5" />}
                        tooltip="Text Tool"
                    />
                    <div className="w-px h-8 bg-blue-200 dark:bg-blue-700" />
                    <IconButton 
                        onClick={onReset}
                        activated={false} 
                        icon={<RotateCcw className="h-5 w-5" />}
                        tooltip="Reset View"
                    />
                </div>
                <ThemeToggle />
            </div>

            {/* User Info & Room Info */}
            <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-blue-200 dark:border-blue-800 rounded-2xl p-4 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-foreground">{user?.name}</p>
                            <p className="text-muted-foreground">Room #{roomId}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="fixed bottom-6 left-6 z-50">
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-blue-200 dark:border-blue-800 rounded-2xl p-4 shadow-2xl max-w-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Palette className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-foreground mb-1">Quick Tips</p>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                                • Mouse wheel to zoom • Drag to pan • Select tools above • Share room URL to collaborate
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}