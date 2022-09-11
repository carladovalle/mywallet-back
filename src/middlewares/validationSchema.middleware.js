import joi from "joi";

const transactionsSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
});

async function validation (req, res, next) {

    try {

        const validation = transactionsSchema.validate(req.body, { abortEarly: false });

        if (validation.error) {
            const e = validation.error.details.map(errors => errors.message);
            res.status(422).send(e);
            return;
        }

        next();

    } catch (error) {
        console.log(error);
        return res.send(500);
      }
}

export default validation;