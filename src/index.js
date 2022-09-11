import express from "express";
import cors from "cors";
import chalk from "chalk";

import participantRouter from './routers/participants.routers.js';
import transactionsRouter from './routers/transactions.routers.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use(participantRouter);
app.use(transactionsRouter);

app.listen(5000, () => {
    console.log(chalk.blue("Servidor rodando."));
});