import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", authenticate, authorize("admin"), register);
router.post("/login", login);
router.get("/me", authenticate, me);

export default router;
