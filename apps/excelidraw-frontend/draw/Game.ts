import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape = {
    id: string;
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    id: string;
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    id: string;
    type: "pencil";
    points: { x: number; y: number }[];
} | {
    id: string;
    type: "text";
    x: number;
    y: number;
    text: string;
    fontSize: number;
}

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "pencil";
    private pencilPoints: { x: number; y: number }[] = [];
    private scale = 1;
    private offsetX = 0;
    private offsetY = 0;
    private isTyping = false;
    private textInput: HTMLInputElement | null = null;
    private isDragging = false;
    private lastPanX = 0;
    private lastPanY = 0;

    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas);
        
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
        this.initZoomAndPan();
        this.initThemeHandler();
    }
    
    destroy() {
        window.removeEventListener('resize', this.resizeCanvas);
        window.removeEventListener('themeChanged', this.handleThemeChange);
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.removeEventListener("wheel", this.wheelHandler);
        this.removeTextInput();
    }

    initThemeHandler() {
        window.addEventListener('themeChanged', this.handleThemeChange);
    }

    handleThemeChange = () => {
        this.clearCanvas();
    };

    resizeCanvas = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.clearCanvas();
    };

    setTool(tool: Tool) {
        this.selectedTool = tool;
        if (tool !== "text") {
            this.removeTextInput();
        }
    }

    removeTextInput() {
        if (this.textInput) {
            this.textInput.remove();
            this.textInput = null;
            this.isTyping = false;
        }
    }

    // Public method to reset view
    resetView() {
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.clearCanvas();
    }

    // Public method to clear all shapes
    clearAllShapes() {
        this.existingShapes = [];
        this.clearCanvas();
        
        // Send clear command to other users
        const message = JSON.stringify({
            type: "clear_canvas",
            roomId: this.roomId
        });
        
        console.log("Sending clear canvas command:", message);
        this.socket.send(message);
    }

    async init() {
        try {
            this.existingShapes = await getExistingShapes(this.roomId);
            this.clearCanvas();
        } catch (error) {
            console.error("Failed to load existing shapes:", error);
            this.existingShapes = [];
            this.clearCanvas();
        }
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Received WebSocket message:", message);

            if (message.type === "chat") {
                try {
                    const parsedShape = JSON.parse(message.message);
                    if (parsedShape.shape) {
                        console.log("Adding shape to canvas:", parsedShape.shape);
                        this.existingShapes.push(parsedShape.shape);
                        this.clearCanvas();
                    }
                } catch (error) {
                    console.error("Failed to parse shape:", error);
                }
            } else if (message.type === "delete_shape") {
                console.log("Deleting shape:", message.shapeId);
                this.existingShapes = this.existingShapes.filter(shape => shape.id !== message.shapeId);
                this.clearCanvas();
            } else if (message.type === "clear_canvas") {
                console.log("Clearing canvas from remote user");
                this.existingShapes = [];
                this.clearCanvas();
            }
        };
    }

    initZoomAndPan() {
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
        // Clear entire canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set background based on theme
        const isDark = document.documentElement.classList.contains('dark');
        this.ctx.fillStyle = isDark ? "#0f172a" : "#ffffff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.applyTransform();

        // Draw all existing shapes with null check
        this.existingShapes.forEach((shape) => {
            if (!shape || !shape.type) {
                console.warn("Invalid shape found:", shape);
                return;
            }

            const isDark = document.documentElement.classList.contains('dark');
            this.ctx.strokeStyle = isDark ? "#e2e8f0" : "#1e293b";
            this.ctx.fillStyle = isDark ? "#e2e8f0" : "#1e293b";
            this.ctx.lineWidth = 2;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            
            if (shape.type === "rect") {
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "pencil" && shape.points && shape.points.length > 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
                for (let i = 1; i < shape.points.length; i++) {
                    this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
                }
                this.ctx.stroke();
            } else if (shape.type === "text") {
                this.ctx.font = `${shape.fontSize}px Inter, system-ui, sans-serif`;
                this.ctx.fillText(shape.text, shape.x, shape.y);
            }
        });

        this.resetTransform();
    }

    generateShapeId(): string {
        return `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    mouseDownHandler = (e: MouseEvent) => {
        if (e.button === 1 || e.button === 2) { // Middle or right click for panning
            this.isDragging = true;
            this.lastPanX = e.clientX;
            this.lastPanY = e.clientY;
            this.canvas.style.cursor = "grabbing";
            return;
        }

        if (this.selectedTool === "text") {
            this.removeTextInput();
            const coords = this.getTransformedCoordinates(e.clientX, e.clientY);
            this.createTextInput(coords.x, coords.y);
            return;
        }
        
        this.clicked = true;
        const coords = this.getTransformedCoordinates(e.clientX, e.clientY);
        this.startX = coords.x;
        this.startY = coords.y;
        
        if (this.selectedTool === "pencil") {
            this.pencilPoints = [{ x: coords.x, y: coords.y }];
        }
    };

    createTextInput(x: number, y: number) {
        this.removeTextInput();
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Type here...';
        input.style.position = 'absolute';
        input.style.left = `${x * this.scale + this.offsetX}px`;
        input.style.top = `${y * this.scale + this.offsetY - 10}px`;
        input.style.fontSize = `${20 * this.scale}px`;
        input.style.border = '2px solid #3b82f6';
        input.style.borderRadius = '8px';
        input.style.padding = '8px 12px';
        input.style.background = 'white';
        input.style.color = '#1e293b';
        input.style.zIndex = '1001';
        input.style.minWidth = '120px';
        input.style.fontFamily = 'Inter, system-ui, sans-serif';
        input.style.outline = 'none';
        
        this.textInput = input;
        this.isTyping = true;
        document.body.appendChild(input);
        input.focus();
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && input.value.trim()) {
                const shape: Shape = {
                    id: this.generateShapeId(),
                    type: "text",
                    x,
                    y: y + 20, // Adjust for baseline
                    text: input.value.trim(),
                    fontSize: 20
                };
                
                this.addShape(shape);
                this.removeTextInput();
            } else if (e.key === 'Escape') {
                this.removeTextInput();
            }
        };
        
        input.addEventListener('keydown', handleKeyDown);
        input.addEventListener('blur', () => {
            if (input.value.trim()) {
                const shape: Shape = {
                    id: this.generateShapeId(),
                    type: "text",
                    x,
                    y: y + 20,
                    text: input.value.trim(),
                    fontSize: 20
                };
                this.addShape(shape);
            }
            this.removeTextInput();
        });
    }

    addShape(shape: Shape) {
        console.log("Adding shape locally:", shape);
        this.existingShapes.push(shape);
        this.clearCanvas();
        
        const message = JSON.stringify({
            type: "chat",
            message: JSON.stringify({ shape }),
            roomId: this.roomId
        });
        
        console.log("Sending shape via WebSocket:", message);
        this.socket.send(message);
    }

    mouseUpHandler = (e: MouseEvent) => {
        if (this.isDragging) {
            this.isDragging = false;
            this.canvas.style.cursor = this.selectedTool === "pencil" ? "crosshair" : 
                                      this.selectedTool === "text" ? "text" : "default";
            return;
        }

        if (!this.clicked || this.selectedTool === "text") return;
        
        this.clicked = false;
        const coords = this.getTransformedCoordinates(e.clientX, e.clientY);
        const width = coords.x - this.startX;
        const height = coords.y - this.startY;

        let shape: Shape | null = null;
        
        if (this.selectedTool === "rect" && (Math.abs(width) > 5 || Math.abs(height) > 5)) {
            shape = {
                id: this.generateShapeId(),
                type: "rect",
                x: Math.min(this.startX, coords.x),
                y: Math.min(this.startY, coords.y),
                height: Math.abs(height),
                width: Math.abs(width)
            };
        } else if (this.selectedTool === "circle") {
            const radius = Math.sqrt(width * width + height * height) / 2;
            if (radius > 5) {
                shape = {
                    id: this.generateShapeId(),
                    type: "circle",
                    radius: radius,
                    centerX: this.startX + width / 2,
                    centerY: this.startY + height / 2,
                };
            }
        } else if (this.selectedTool === "pencil" && this.pencilPoints.length > 1) {
            shape = {
                id: this.generateShapeId(),
                type: "pencil",
                points: [...this.pencilPoints]
            };
        }

        if (shape) {
            this.addShape(shape);
        }
    };

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.isDragging) {
            const deltaX = e.clientX - this.lastPanX;
            const deltaY = e.clientY - this.lastPanY;
            
            this.offsetX += deltaX;
            this.offsetY += deltaY;
            
            this.lastPanX = e.clientX;
            this.lastPanY = e.clientY;
            
            this.clearCanvas();
            return;
        }

        if (this.clicked) {
            const coords = this.getTransformedCoordinates(e.clientX, e.clientY);
            
            if (this.selectedTool === "pencil") {
                this.pencilPoints.push({ x: coords.x, y: coords.y });
                this.clearCanvas();
                
                // Draw current pencil stroke
                this.applyTransform();
                const isDark = document.documentElement.classList.contains('dark');
                this.ctx.strokeStyle = isDark ? "#3b82f6" : "#1d4ed8";
                this.ctx.lineWidth = 2;
                this.ctx.lineCap = "round";
                this.ctx.lineJoin = "round";
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
            this.ctx.strokeStyle = "#3b82f6";
            this.ctx.lineWidth = 2;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            
            if (this.selectedTool === "rect") {
                this.ctx.strokeRect(
                    Math.min(this.startX, coords.x), 
                    Math.min(this.startY, coords.y), 
                    Math.abs(width), 
                    Math.abs(height)
                );
            } else if (this.selectedTool === "circle") {
                const radius = Math.sqrt(width * width + height * height) / 2;
                const centerX = this.startX + width / 2;
                const centerY = this.startY + height / 2;
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
        
        // Prevent context menu on right click
        this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    }
}