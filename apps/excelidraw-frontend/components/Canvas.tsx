import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon, RotateCcw, ArrowLeft, Palette, Users, Trash2, Copy, Download, Eraser } from "lucide-react";
import { Game } from "@/draw/Game";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export type Tool = "circle" | "rect" | "pencil" | "eraser" | "text";

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
    const [showCopied, setShowCopied] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
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
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
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
        game?.resetView();
    };

    const clearCanvas = () => {
        game?.clearAllShapes();
    };

    const copyRoomUrl = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    };

    const downloadCanvas = () => {
        if (canvasRef.current) {
            const link = document.createElement('a');
            link.download = `drawing-room-${roomId}.png`;
            link.href = canvasRef.current.toDataURL();
            link.click();
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden relative clean-bg-primary">
            <canvas 
                ref={canvasRef} 
                className={`absolute inset-0 ${
                    selectedTool === "pencil" ? "cursor-crosshair" : 
                    selectedTool === "eraser" ? "cursor-pointer" : "cursor-default"
                }`}
            />
            <Topbar 
                setSelectedTool={setSelectedTool} 
                selectedTool={selectedTool}
                onReset={resetCanvas}
                onClear={clearCanvas}
                onBack={() => router.push("/room")}
                onCopyUrl={copyRoomUrl}
                onDownload={downloadCanvas}
                user={user}
                roomId={roomId}
                showCopied={showCopied}
                isMobile={isMobile}
            />
        </div>
    );
}

function Topbar({
    selectedTool, 
    setSelectedTool, 
    onReset, 
    onClear,
    onBack, 
    onCopyUrl,
    onDownload,
    user, 
    roomId,
    showCopied,
    isMobile
}: {
    selectedTool: Tool;
    setSelectedTool: (s: Tool) => void;
    onReset: () => void;
    onClear: () => void;
    onBack: () => void;
    onCopyUrl: () => void;
    onDownload: () => void;
    user: any;
    roomId: string;
    showCopied: boolean;
    isMobile: boolean;
}) {
    return (
        <>
            {/* Main Toolbar */}
            <div className={`fixed ${isMobile ? 'top-2 left-2' : 'top-6 left-6'} z-50 flex ${isMobile ? 'flex-col' : 'items-center'} gap-2 sm:gap-4`}>
                <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-2'} bg-slate-800 border border-slate-600 rounded-xl ${isMobile ? 'p-2' : 'p-3'} shadow-xl ${isMobile ? 'flex-wrap' : ''}`}>
                    <IconButton 
                        onClick={onBack}
                        activated={false}
                        icon={<ArrowLeft className="h-5 w-5" />}
                        tooltip="Back to rooms"
                        isMobile={isMobile}
                    />
                    {!isMobile && <div className="w-px h-8 bg-slate-600" />}
                    <IconButton 
                        onClick={() => setSelectedTool("pencil")}
                        activated={selectedTool === "pencil"}
                        icon={<Pencil className="h-5 w-5" />}
                        tooltip="Pencil Tool"
                        isMobile={isMobile}
                    />
                    <IconButton 
                        onClick={() => setSelectedTool("rect")} 
                        activated={selectedTool === "rect"} 
                        icon={<RectangleHorizontalIcon className="h-5 w-5" />} 
                        tooltip="Rectangle Tool"
                        isMobile={isMobile}
                    />
                    <IconButton 
                        onClick={() => setSelectedTool("circle")} 
                        activated={selectedTool === "circle"} 
                        icon={<Circle className="h-5 w-5" />}
                        tooltip="Circle Tool"
                        isMobile={isMobile}
                    />
                    <IconButton 
                        onClick={() => setSelectedTool("eraser")} 
                        activated={selectedTool === "eraser"} 
                        icon={<Eraser className="h-5 w-5" />}
                        tooltip="Eraser Tool"
                        isMobile={isMobile}
                    />
                    {!isMobile && <div className="w-px h-8 bg-slate-600" />}
                    <IconButton 
                        onClick={onReset}
                        activated={false} 
                        icon={<RotateCcw className="h-5 w-5" />}
                        tooltip="Reset View"
                        isMobile={isMobile}
                    />
                    <IconButton 
                        onClick={onClear}
                        activated={false} 
                        icon={<Trash2 className="h-5 w-5" />}
                        tooltip="Clear Canvas"
                        isMobile={isMobile}
                    />
                </div>
                {!isMobile && <ThemeToggle />}
            </div>

            {/* User Info & Room Info (hidden on mobile) */}
            <div className="hidden sm:fixed sm:top-6 sm:right-6 sm:z-50 sm:flex sm:items-center sm:gap-4">
            <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm">
                    <p className="font-semibold text-white">{user?.name}</p>
                    <p className="text-slate-400">Room ID: {roomId}</p>
                </div>
                </div>
            </div>

            {/* Theme toggle only on desktop */}
            <ThemeToggle />
            </div>

            {/* Action Buttons */}
            <div className={`fixed ${isMobile ? 'bottom-2 right-2' : 'bottom-6 right-6'} z-50 flex items-center gap-2 sm:gap-3`}>
                <div className="relative">
                    <IconButton 
                        onClick={onCopyUrl}
                        activated={false}
                        icon={<Copy className="h-5 w-5" />}
                        tooltip="Copy Room URL"
                        isMobile={isMobile}
                    />
                    {showCopied && (
                        <div className={`absolute ${isMobile ? '-top-8' : '-top-12'} left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white text-xs px-3 py-1 rounded-lg backdrop-blur-sm`}>
                            Copied!
                        </div>
                    )}
                </div>
                <IconButton 
                    onClick={onDownload}
                    activated={false}
                    icon={<Download className="h-5 w-5" />}
                    tooltip="Download Canvas"
                    isMobile={isMobile}
                />
            </div>

            {/* Instructions */}
            <div className={`fixed ${isMobile ? 'bottom-2 left-2' : 'bottom-6 left-6'} z-50 ${isMobile ? 'hidden' : 'block'}`}>
                <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 shadow-xl max-w-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Palette className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-white mb-1">Quick Tips</p>
                            <p className="text-slate-300 text-xs leading-relaxed">
                                • Mouse wheel to zoom • Right-click + drag to pan • Select tools above • Eraser: click shapes to delete • Copy URL to share
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Instructions - Show as overlay when needed */}
            {isMobile && (
                <div className="fixed bottom-16 left-2 right-2 z-40">
                    <div className="bg-slate-800/90 border border-slate-600 rounded-lg p-3 shadow-xl backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Palette className="h-3 w-3 text-white" />
                            </div>
                            <div className="text-xs">
                                <p className="font-semibold text-white mb-1">Mobile Tips</p>
                                <p className="text-slate-300 text-xs leading-relaxed">
                                    Pinch to zoom • Drag to pan • Use tools above • Tap shapes with eraser to delete
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}