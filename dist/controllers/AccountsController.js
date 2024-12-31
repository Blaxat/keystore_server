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
exports.deleteAccount = exports.createAccount = exports.verifyPassword = exports.getDetails = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Client = new client_1.PrismaClient();
const getDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phrase = req.phrase;
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
        const Accounts = yield Client.account.findMany({
            where: {
                userId: User.id
            }
        });
        const keyPair = {};
        const accounts = [];
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        return;
    }
});
exports.getDetails = getDetails;
const verifyPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phrase = req.phrase;
        const password = req.body.password;
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
        const verified = yield bcrypt_1.default.compare(password, User.password);
        if (!verified) {
            res.status(400).json({
                message: "Incorrect Password"
            });
            return;
        }
        res.status(200).json({
            message: "Correct Password"
        });
        return;
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        return;
    }
});
exports.verifyPassword = verifyPassword;
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phrase = req.phrase;
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
        yield Client.account.create({
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        return;
    }
});
exports.createAccount = createAccount;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phrase = req.phrase;
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
        yield Client.account.delete({
            where: {
                eth_private_key: req.body.eth_private_key
            }
        });
        res.status(200).json({
            message: "Account deleted"
        });
        return;
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        return;
    }
});
exports.deleteAccount = deleteAccount;
