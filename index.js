import express from "express";
import cors from "cors";
import chalk from "chalk";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Servidor ok");
})

app.listen(5000, () => {
    console.log(chalk.blue("Servidor rodando."));
});