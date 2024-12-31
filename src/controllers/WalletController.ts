import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Request, Response } from "express";

const Client = new PrismaClient();

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const phrase = req.body.phrase;
        const password = req.body.password;


        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

        const passwordSchema = z.object({
            password: z.string().regex(passwordRegex, {
                message: "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character"
            })
        });
        
        passwordSchema.parse({ password });
    
        const User = await Client.user.findUnique({
            where: {
                phrase: phrase
            }
        });
    
        if(User) {
            res.status(400).json({
                message: "Phrase already exists"
            });
            return;
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        await Client.user.create({
            data: {
               phrase: phrase,
               password: hashedPassword 
            }
        });

        const secret = process.env.JWT_SECRET;

        if (!secret) {
          throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const token = jwt.sign(
            {payload: phrase},
            secret
        );

        console.log('TOKEN', token);
    
        res.status(200).json({
            message: "Wallet Added",
            token: token
        });
        return;

    } catch (err) {
        if (err instanceof z.ZodError) {
        res.status(400).json({ errors: err.errors });
        } else {
        res.status(500).json({ message: (err as Error).message });
        }
        return; 
    }
}

export const verifyUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const phrase = req.body.phrase;
        const password = req.body.password;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

        const passwordSchema = z.object({
            password: z.string().regex(passwordRegex, {
                message: "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character"
            })
        });
        
        passwordSchema.parse({ password });
    
        const User = await Client.user.findUnique({
            where: {
                phrase: phrase
            }
        });
    
        if(!User) {
            res.status(404).json({
                message: "Phrase does not exist"
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
    
        await Client.user.update({
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

        const token = jwt.sign(
            {payload: phrase},
            secret
        );
    
        res.status(200).json({
            message: "Phrase Verified",
            token: token
        });
        return;

    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ errors: err.errors });
        } else {
            res.status(500).json({ message: (err as Error).message });
        }
        return; 
    }
}

export const verifyPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const phrase = req.phrase;
        const password = req.body.password;
    
        const User = await Client.user.findFirst({
            where: {
                phrase: phrase
            }
        });
    
        if(!User) {
            res.status(404).json({
                message: "Phrase does not exist"
            });
            return;
        }

        const verified = await bcrypt.compare(password, User.password);
    
        if(!verified) {
            res.status(400).json({
                message: "Incorrect Password"
            });
            return;
        }
    
        res.status(200).json({
            message: "Verified"
        });
        return;

    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
        return; 
    }
}
