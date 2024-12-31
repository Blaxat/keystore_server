import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';

const Client = new PrismaClient();

export const getDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const phrase = req.phrase;
    
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

        const Accounts = await Client.account.findMany({
            where: {
                userId: User.id
            }
        })
        
        const keyPair: Record<string, any> = {};
        const accounts: string[] = [];

        Accounts.forEach((account) => {
            accounts.push(account.name);
            keyPair[account.name] = {
                eth: { privateKey: account.eth_private_key, publicKey: account.eth_public_key },
                sol: { privateKey: account.sol_private_key, publicKey: account.sol_public_key }
            };
        });
    
        accounts.sort((a, b) => {
            const numA = parseInt(a.split(" ")[1]);
            const numB = parseInt(b.split(" ")[1]);
            return numA - numB;
        });

        res.status(200).json({
            keyPair: keyPair,
            secretPhrase: User.phrase,
            accounts: accounts,
            mnemonics: phrase
        });
        return;

    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
        return; 
    }
}

export const verifyPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const phrase = req.phrase;
        const password = req.body.password;
    
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
        
        const verified = await bcrypt.compare(password, User.password);

        if(!verified) {
            res.status(400).json({
                message: "Incorrect Password"
            });
            return;
        }

        res.status(200).json({
            message: "Correct Password"
        });
        return;

    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
        return; 
    }
}


export const createAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const phrase = req.phrase;
    
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

        await Client.account.create({
            data: {
                eth_private_key: req.body.eth_private_key,
                eth_public_key: req.body.eth_public_key, 
                sol_private_key: req.body.sol_private_key,
                sol_public_key: req.body.sol_public_key,
                name: req.body.name, 
                userId: User.id
            }
        });

        res.status(200).json({
            message: "Account Created"
        });
        return;

    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
        return; 
    }
}

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const phrase = req.phrase;
    
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

        await Client.account.delete({
            where: {
                eth_private_key: req.body.eth_private_key
            }
        });

        res.status(200).json({
            message: "Account deleted"
        });
        return;

    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
        return; 
    }
}