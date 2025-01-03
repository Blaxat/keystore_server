"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.token;
    if (!token) {
        res.status(400).json({ message: "Token not found" });
        return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT_SECRET is not defined in environment variables");
        throw new Error("Server configuration error");
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, secret);
        if (!verified || !verified.payload) {
            res.status(400).json({ message: "Invalid token" });
            return;
        }
        req.phrase = verified.payload;
        next();
    }
    catch (error) {
        console.error("Token verification error:", error.message);
        res.status(500).json({ message: "Invalid or expired token" });
        return;
    }
});
exports.middleware = middleware;
