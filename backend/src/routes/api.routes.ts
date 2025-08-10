import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
    getWordOfTheDay,
    getUserProgress,
    getAllVerbs,
    toggleFavorite,
    correctSentence
} from "../controllers/data.controllers";

const router = Router();

// All routes in this file are protected by the authMiddleware
router.use(authMiddleware);

// Route definitions
router.get("/words/daily", getWordOfTheDay);
router.get("/users/progress", getUserProgress);
router.get("/verbs", getAllVerbs);
router.post("/verbs/:id/favorite", toggleFavorite);
router.post("/chat/correct", correctSentence);

export default router;
