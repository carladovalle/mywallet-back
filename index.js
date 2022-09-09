import express from "express";
import cors from "cors";
import chalk from "chalk";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
    db = mongoClient.db("mywallet");
})

app.post("/sign-up", async (req,res) => {

    const {name, email, password, confirmPassword} = req.body;

    const hashPassword = bcrypt.hashSync(password, 10);

    try {
        db.collection("users").insertOne({
            name,
            email,
            password: hashPassword,
            confirmPassword
        });
    } catch (error) {
        console.error(error);
        return res.send(500);
    }
    res.sendStatus(201);
});

app.listen(5000, () => {
    console.log(chalk.blue("Servidor rodando."));
});