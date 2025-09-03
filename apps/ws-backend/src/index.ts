import { WebSocket, WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from "@repo/db/client";

const PORT = process.env.WS_PORT || 8080;
const wss = new WebSocketServer({ port: Number(PORT) });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === "string") {
            return null;
        }

        if (!decoded || !decoded.userId) {
            return null;
        }

        return decoded.userId;
    } catch(e) {
        console.error("Token verification failed:", e);
        return null;
    }
}

console.log(`WebSocket server starting on port ${PORT}`);

wss.on('connection', function connection(ws, request) {
    console.log('New WebSocket connection attempt');
    
    const url = request.url;
    if (!url) {
        console.log('No URL provided');
        ws.close();
        return;
    }
    
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = checkUser(token);

    if (userId === null) {
        console.log('Invalid token, closing connection');
        ws.close();
        return;
    }

    console.log(`User ${userId} connected`);
    
    const newUser: User = {
        userId,
        rooms: [],
        ws
    };
    
    users.push(newUser);

    ws.on('message', async function message(data) {
        try {
            let parsedData;
            if (typeof data !== "string") {
                parsedData = JSON.parse(data.toString());
            } else {
                parsedData = JSON.parse(data);
            }

            console.log("Message received:", parsedData);

            if (parsedData.type === "join_room") {
                const user = users.find(x => x.ws === ws);
                if (user && !user.rooms.includes(parsedData.roomId)) {
                    user.rooms.push(parsedData.roomId);
                    console.log(`User ${userId} joined room ${parsedData.roomId}`);
                }
            }

            if (parsedData.type === "leave_room") {
                const user = users.find(x => x.ws === ws);
                if (user) {
                    user.rooms = user.rooms.filter(x => x !== parsedData.roomId);
                    console.log(`User ${userId} left room ${parsedData.roomId}`);
                }
            }

            if (parsedData.type === "chat") {
                const roomId = parsedData.roomId;
                const message = parsedData.message;

                // Save to database
                await prismaClient.chat.create({
                    data: {
                        roomId: Number(roomId),
                        message,
                        userId
                    }
                });

                // Broadcast to all users in the room
                const usersInRoom = users.filter(user => user.rooms.includes(roomId));
                console.log(`Broadcasting to ${usersInRoom.length} users in room ${roomId}`);
                
                usersInRoom.forEach(user => {
                    if (user.ws.readyState === WebSocket.OPEN) {
                        user.ws.send(JSON.stringify({
                            type: "chat",
                            message: message,
                            roomId
                        }));
                    }
                });
            }

            if (parsedData.type === "delete_shape") {
                const roomId = parsedData.roomId;
                const shapeId = parsedData.shapeId;

                // Broadcast delete to all users in the room
                const usersInRoom = users.filter(user => user.rooms.includes(roomId));
                console.log(`Broadcasting shape deletion to ${usersInRoom.length} users in room ${roomId}`);
                
                usersInRoom.forEach(user => {
                    if (user.ws.readyState === WebSocket.OPEN) {
                        user.ws.send(JSON.stringify({
                            type: "delete_shape",
                            shapeId: shapeId,
                            roomId
                        }));
                    }
                });
            }

            if (parsedData.type === "clear_canvas") {
                const roomId = parsedData.roomId;

                // Clear all shapes from database for this room
                await prismaClient.chat.deleteMany({
                    where: {
                        roomId: Number(roomId)
                    }
                });

                // Broadcast clear to all users in the room
                const usersInRoom = users.filter(user => user.rooms.includes(roomId));
                console.log(`Broadcasting canvas clear to ${usersInRoom.length} users in room ${roomId}`);
                
                usersInRoom.forEach(user => {
                    if (user.ws.readyState === WebSocket.OPEN) {
                        user.ws.send(JSON.stringify({
                            type: "clear_canvas",
                            roomId
                        }));
                    }
                });
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
    });

    ws.on('close', () => {
        const userIndex = users.findIndex(x => x.ws === ws);
        const user = users[userIndex];
        if (user) {
            console.log(`User ${user.userId} disconnected`);
            users.splice(userIndex, 1);
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

console.log(`WebSocket server running on port ${PORT}`);