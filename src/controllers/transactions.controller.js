import db from '../database/db.js';

const create = async (req, res) => {

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

const list = async (req, res) => {

    try {

        const entries = await db.collection("money").find().toArray();

        res.send(entries);

    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
    
}

export { create, list }