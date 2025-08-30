import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    points: { x: number; y: number }[];
}

export class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "circle";
    private pencilPoints: { x: number; y: number }[] = [];
    private scale = 1;
    private offsetX = 0;
    private offsetY = 0;

    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
        this.initZoomAndPan();
    }
    
    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.removeEventListener("wheel", this.wheelHandler);
    }

    setTool(tool: "circle" | "pencil" | "rect") {
        this.selectedTool = tool;
    }

    async init() {
        try {
            this.existingShapes = await getExistingShapes(this.roomId);
        } catch (error) {
            console.error("Failed to load existing shapes:", error);
            this.existingShapes = [];
        }
        console.log(this.existingShapes);
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === "chat") {
                try {
                    const parsedShape = JSON.parse(message.message);
                    if (parsedShape.shape) {
                        this.existingShapes.push(parsedShape.shape);
                        this.clearCanvas();
                    }
                } catch (error) {
                    console.error("Failed to parse shape:", error);
                }
            }
        };
    }

    initZoomAndPan() {
        // Add zoom functionality
        this.canvas.addEventListener("wheel", this.wheelHandler);
    }

    wheelHandler = (e: WheelEvent) => {
        e.preventDefault();
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const zoom = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.1, Math.min(5, this.scale * zoom));
        
        if (newScale !== this.scale) {
            // Adjust offset to zoom towards mouse position
            this.offsetX = mouseX - (mouseX - this.offsetX) * (newScale / this.scale);
            this.offsetY = mouseY - (mouseY - this.offsetY) * (newScale / this.scale);
            this.scale = newScale;
            
            this.clearCanvas();
        }
    };

    getTransformedCoordinates(clientX: number, clientY: number) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (clientX - rect.left - this.offsetX) / this.scale,
            y: (clientY - rect.top - this.offsetY) / this.scale
        };
    }

    applyTransform() {
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);
    }

    resetTransform() {
        this.ctx.restore();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.applyTransform();

        this.existingShapes.forEach((shape) => {
            this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
            this.ctx.lineWidth = 2;
            
            if (shape.type === "rect") {
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "pencil" && shape.points.length > 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
                for (let i = 1; i < shape.points.length; i++) {
                    this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
                }
                this.ctx.stroke();
                this.clearCanvas();
            }
        });

        this.resetTransform();
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        const coords = this.getTransformedCoordinates(e.clientX, e.clientY);
        this.startX = coords.x;
        this.startY = coords.y;
        
        if (this.selectedTool === "pencil") {
            this.pencilPoints = [{ x: coords.x, y: coords.y }];
        }
    };

    mouseUpHandler = (e: MouseEvent) => {
        if (!this.clicked) return;
        
        this.clicked = false;
        const coords = this.getTransformedCoordinates(e.clientX, e.clientY);
        const width = coords.x - this.startX;
        const height = coords.y - this.startY;

        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
        
        if (selectedTool === "rect") {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                height,
                width
            };
        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
            };
        } else if (selectedTool === "pencil" && this.pencilPoints.length > 1) {
            shape = {
                type: "pencil",
                points: [...this.pencilPoints]
            };
        }

        if (!shape) {
            return;
        }

        this.existingShapes.push(shape);

        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId: this.roomId
        }));
    };

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            const coords = this.getTransformedCoordinates(e.clientX, e.clientY);
            
            if (this.selectedTool === "pencil") {
                this.pencilPoints.push({ x: coords.x, y: coords.y });
                this.clearCanvas();
                
                // Draw current pencil stroke
                this.applyTransform();
                this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(this.pencilPoints[0].x, this.pencilPoints[0].y);
                for (let i = 1; i < this.pencilPoints.length; i++) {
                    this.ctx.lineTo(this.pencilPoints[i].x, this.pencilPoints[i].y);
                }
                this.ctx.stroke();
                this.resetTransform();
                return;
            }
            
            const width = coords.x - this.startX;
            const height = coords.y - this.startY;
            this.clearCanvas();
            
            this.applyTransform();
            this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
            this.ctx.lineWidth = 2;
            
            const selectedTool = this.selectedTool;
            if (selectedTool === "rect") {
                this.ctx.strokeRect(this.startX, this.startY, width, height);
            } else if (selectedTool === "circle") {
                const radius = Math.max(width, height) / 2;
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            
            this.resetTransform();
        }
    };

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }
}