"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const WalletRoutes_1 = require("./routes/WalletRoutes");
const AccountsRoutes_1 = require("./routes/AccountsRoutes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL
}));
app.use('/api/wallet', WalletRoutes_1.WalletRoutes);
app.use('/api/accounts', AccountsRoutes_1.AccountsRoutes);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
});
