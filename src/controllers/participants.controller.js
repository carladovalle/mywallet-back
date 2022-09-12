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

const register = async (req, res) => {

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

const login = async (req, res) => {

    try {

        const user = req.body;

        const validation = loginParticipantsSchema.validate(user, { abortEarly: false });
    
        if (validation.error) {
            const e = validation.error.details.map(errors => errors.message);
            res.status(422).send(e);
            return;
        }
    
        const checkUser = await db.collection('users').findOne({ email: user.email });
    
        if (!checkUser) {
            return res.status(422);
        }

        const decryptedPassword = bcrypt.compareSync(user.password, checkUser.password);

        if (decryptedPassword) {

            const token = uuid();
            await db.collection('sessions').insertOne({ token, userId: checkUser._id });

            return res.status(200).send({ token, name: checkUser.name });
        }
    } catch (error) {
        console.error(error);
        return res.send(500);
    }
    
}

export { register, login };