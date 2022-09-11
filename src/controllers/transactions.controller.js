import joi from "joi";
import db from '../database/db.js';

const transactionsSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
});

async function createTransaction (req, res) {

    const validation = transactionsSchema.validate(req.body, { abortEarly: false });

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

}

async function getTransaction (req, res) {

    try {

        const entries = await db.collection("money").find().toArray();

        res.send(entries);

    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
    
}

export { createTransaction, getTransaction }