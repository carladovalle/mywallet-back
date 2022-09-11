import express from "express";
import cors from "cors";
import chalk from "chalk";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid'; 
import joi from "joi";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
    db = mongoClient.db("mywallet");
});

const registrationParticipantsSchema = joi.object({
    name: joi.string().alphanum().required(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmPassword: joi.ref('password'),
});

const loginParticipantsSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

const entriesAndExitsSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
})

app.post("/sign-up", async (req,res) => {

    const validation = registrationParticipantsSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const e = validation.error.details.map(errors => errors.message);
        res.status(422).send(e);
        return;
    }

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

    const validation = loginParticipantsSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const e = validation.error.details.map(errors => errors.message);
        res.status(422).send(e);
        return;
    }

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
    
});

app.post("/entry", async (req, res) => {

    const validation = entriesAndExitsSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const e = validation.error.details.map(errors => errors.message);
        res.status(422).send(e);
        return;
    }

    try {

        const body = req.body;

        await db.collection("money").insertOne({
            value: body.value,
            description: body.description
        });

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }

});

app.get("/entry", async (req, res) => {

    try {

        const entries = await db.collection("money").find().toArray();

        res.send(entries);

    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
    
});

app.post("/exit", async (req, res) => {

    const validation = entriesAndExitsSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const e = validation.error.details.map(errors => errors.message);
        res.status(422).send(e);
        return;
    }

    try {

        const body = req.body;

        await db.collection("money").insertOne({
            value: body.value,
            description: body.description
        });

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }

});

app.get("/exit", async (req, res) => {

    try {

        const exits = await db.collection("money").find().toArray();

        res.send(exits);

    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
    
});

app.listen(5000, () => {
    console.log(chalk.blue("Servidor rodando."));
});