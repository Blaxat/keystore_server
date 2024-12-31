import { Router } from "express";
import { middleware } from "../middleware/middleware";
import { deleteAccount, getDetails, verifyPassword, createAccount } from "../controllers/AccountsController";

export const AccountsRoutes = Router();

AccountsRoutes.get('/get', middleware, getDetails);
AccountsRoutes.post('/verify', middleware, verifyPassword);
AccountsRoutes.post('/delete', middleware, deleteAccount);
AccountsRoutes.post('/add', middleware, createAccount);