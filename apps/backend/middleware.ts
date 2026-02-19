import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.headers["authorization"];

    // 1. Check if header exists and has the correct Bearer format
    if (!header || !header.startsWith("Bearer ")) {
        console.log("Auth Error: Missing or malformed header");
        return res.status(401).json({
            message: "you are not logged in (missing token)",
        });
    }

    const token = header.split(" ")[1];

    try {
        const response = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;

        // 2. Critical Check: Does the token actually contain an 'id'?
        if (!response.id) {
            console.log("Auth Error: Token verified but 'id' is missing in payload");
            return res.status(401).json({ message: "Invalid token payload" });
        }

        req.userId = response.id;
        next();

    } catch (e: any) {
        console.log("JWT Verification Failed:", e.message);
        res.status(401).json({
            message: "you are not logged in (invalid token)",
        });
    }
}