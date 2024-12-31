"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = require("express");
const WalletController_1 = require("../controllers/WalletController");
exports.WalletRoutes = (0, express_1.Router)();
exports.WalletRoutes.post('/create', WalletController_1.createUser);
exports.WalletRoutes.post('/verify', WalletController_1.verifyUser);
