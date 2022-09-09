import express from "express";
import cors from "cors";
import chalk from "chalk";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid'; 

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

app.post("/sign-in", async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await db.collection("users").findOne({email});

        if(!user) {
            return res.status(404).send("Usuário não encontrado");
        }

        const isValid = bcrypt.compareSync(password, user.password);

        if (!isValid) {
            return res.status(404).send("Usuário ou senha inválidos.");
        }

        if (user && isValid) {
            
            const token = uuid();

            db.collection("users").insertOne({
                token,
                userId: user._id,
            });

            return res.send(token);
        }
        return res.send(200);
    } catch (error) {
        console.error(error);
        return res.send(500);
    }
    
})

app.listen(5000, () => {
    console.log(chalk.blue("Servidor rodando."));
});