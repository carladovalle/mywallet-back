import joi from "joi";
import db from '../database/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid'; 

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

async function registerUser (req,res) {

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
    
}

async function loginUser (req, res) {

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
    
}

export { registerUser, loginUser };