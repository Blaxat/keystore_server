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
exports.verifyPassword = exports.verifyUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const Client = new client_1.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phrase = req.body.phrase;
        const password = req.body.password;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        const passwordSchema = zod_1.z.object({
            password: zod_1.z.string().regex(passwordRegex, {
                message: "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character"
            })
        });
        passwordSchema.parse({ password });
        const User = yield Client.user.findUnique({
            where: {
                phrase: phrase
            }
        });
        if (User) {
            res.status(400).json({
                message: "Phrase already exists"
            });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield Client.user.create({
            data: {
                phrase: phrase,
                password: hashedPassword
            }
        });
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        const token = jsonwebtoken_1.default.sign({ payload: phrase }, secret);
        console.log('TOKEN', token);
        res.status(200).json({
            message: "Wallet Added",
            token: token
        });
        return;
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            res.status(400).json({ errors: err.errors });
        }
        else {
            res.status(500).json({ message: err.message });
        }
        return;
    }
});
exports.createUser = createUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phrase = req.body.phrase;
        const password = req.body.password;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        const passwordSchema = zod_1.z.object({
            password: zod_1.z.string().regex(passwordRegex, {
                message: "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character"
            })
        });
        passwordSchema.parse({ password });
        const User = yield Client.user.findUnique({
            where: {
                phrase: phrase
            }
        });
        if (!User) {
            res.status(404).json({
                message: "Phrase does not exist"
            });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield Client.user.update({
            where: {
                phrase: phrase
            },
            data: {
                password: hashedPassword
            }
        });
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        const token = jsonwebtoken_1.default.sign({ payload: phrase }, secret);
        res.status(200).json({
            message: "Phrase Verified",
            token: token
        });
        return;
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            res.status(400).json({ errors: err.errors });
        }
        else {
            res.status(500).json({ message: err.message });
        }
        return;
    }
});
exports.verifyUser = verifyUser;
const verifyPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phrase = req.phrase;
        const password = req.body.password;
        const User = yield Client.user.findFirst({
            where: {
                phrase: phrase
            }
        });
        if (!User) {
            res.status(404).json({
                message: "Phrase does not exist"
            });
            return;
        }
        const verified = yield bcrypt_1.default.compare(password, User.password);
        if (!verified) {
            res.status(400).json({
                message: "Incorrect Password"
            });
            return;
        }
        res.status(200).json({
            message: "Verified"
        });
        return;
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        return;
    }
});
exports.verifyPassword = verifyPassword;
