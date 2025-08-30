import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"] as string | undefined;

    if (!authHeader) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    // Accept both "Bearer <token>" and "<token>"
    const parts = authHeader.split(" ");
    const token = parts.length === 2 ? parts[1] : parts[0];

    if (!token) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        // @ts-ignore
        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(403).json({ message: "Unauthorized" });
    }
}