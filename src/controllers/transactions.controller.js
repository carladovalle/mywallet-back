import db from '../database/db.js';
import dayjs from 'dayjs';

const create = async (req, res) => {

    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.send(401);
    }

    try {

        const session = await db.collection("sessions").findOne({
            token,
        });

        if (!session) {
            return res.send(401);
        }

        const user = await db.collection("users").findOne({
            _id: session.userId
        });

        if (!user) {
            return res.status(401);
        }

        const { value, description } = req.body;

        await db.collection('transactions').insertOne({
          value,
          description,
          userId: user._id,
          createAt: dayjs().format('DD/MM')
        });

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }

}

const list = async (req, res) => {

    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.send(401);
    }

    try {

        const session = await db.collection("sessions").findOne({
            token,
        });

        if (!session) {
            return res.send(401);
        }

        const user = await db.collection("users").findOne({
            _id: session.userId
        });

        if (!user) {
            return res.status(401);
        }

        const transactions = await db.collection('transactions').find({ userId: user._id }).toArray();
  
        res.status(200).send(transactions);

    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
    
}

export { create, list }