import { Router } from "express";
import { createUser, verifyUser } from "../controllers/WalletController";

export const WalletRoutes = Router();

WalletRoutes.post('/create', createUser);
WalletRoutes.post('/verify', verifyUser);