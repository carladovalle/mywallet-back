import express from 'express';
import * as transactionsController from '../controllers/transactions.controller.js';

const router = express.Router();

router.post("/transactions", transactionsController.create);
router.get("/transactions", transactionsController.list);

export default router;