import express from "express";
import {
    chatWithGemini,
    getAIConversations,
    getAIConversationById,
    startNewAIConversation,
    deleteAIConversation
} from "../controllers/aiController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.use(isAuthenticated);

router.route("/chat").post(chatWithGemini);
router.route("/conversations").get(getAIConversations);
router.route("/conversation/new").post(startNewAIConversation);
router.route("/conversation/:id").get(getAIConversationById).delete(deleteAIConversation);

export default router;

