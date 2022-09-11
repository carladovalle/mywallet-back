import express from "express";
import cors from "cors";
import chalk from "chalk";

import { registerUser, loginUser } from './controllers/participants.controller.js';
import { createTransaction, getTransaction } from './controllers/transactions.controller.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post("/sign-up", registerUser);

app.post("/sign-in", loginUser);

app.post("/transactions", createTransaction);

app.get("/transactions", getTransaction);

app.listen(5000, () => {
    console.log(chalk.blue("Servidor rodando."));
});