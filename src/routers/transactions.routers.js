import express from 'express';
import * as transactionsController from '../controllers/transactions.controller.js';
import validation from '../middlewares/validationSchema.middleware.js';

const router = express.Router();

router.get("/transactions", transactionsController.list);

router.use(validation);

router.post("/transactions", transactionsController.create);

export default router;