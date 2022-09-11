import express from 'express';
import * as transactionsController from '../controllers/transactions.controller.js';
import validation from '../middlewares/validationSchema.middleware.js';

const router = express.Router();

router.use(validation);

router.post("/transactions", transactionsController.create);
router.get("/transactions", transactionsController.list);

export default router;