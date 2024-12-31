import express  from "express";
import cors from "cors";
import { WalletRoutes } from "./routes/WalletRoutes";
import { AccountsRoutes } from "./routes/AccountsRoutes";

const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL
}));

app.use('/api/wallet', WalletRoutes);
app.use('/api/accounts', AccountsRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
});