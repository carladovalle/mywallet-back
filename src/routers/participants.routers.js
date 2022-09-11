import express from 'express';
import * as participantController from '../controllers/participants.controller.js';

const router = express.Router();

router.post("/sign-up", participantController.register);
router.post("/sign-in", participantController.login);

export default router;