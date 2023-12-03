import {Router, Request, Response} from "express";
import HttpController from "../controllers/HttpController";

const router = Router();

router.post('/get-keys', HttpController.publishKeyHandler);

export default router;