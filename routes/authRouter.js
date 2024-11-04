

import { Router } from "express";
import { googleAuth,googleAuthCallback,authSuccess,authFailure } from '../controllers/authController.js'



const router = Router()


router.get("/", googleAuth);
router.get("/callback", googleAuthCallback);
router.get("/callback/success", authSuccess);
router.get("/callback/failure", authFailure);

export default router;