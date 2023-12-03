import {Router, Request, Response} from "express";
import HttpController from "../controllers/HttpController";

const router = Router();

router.post('/get-keys', HttpController.publishHandler);

router.post('/subscribe', HttpController.subscribeHandler);

export default router;