import AIConversation from "../models/aiConversationModel.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial load
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

// Supported models priority list if requested model is unavailable
const FALLBACK_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-2.0-flash",
    "gemini-1.5-flash"
];

// 1. Send prompt to Gemini with conversational context
export async function chatWithGemini(req, res) {
    try {
        const userId = req.id;
        const { prompt, conversationId } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ message: "Prompt cannot be empty", success: false });
        }

        // Dynamically reload .env if key is not yet present in process.env
        if (!process.env.GEMINI_API_KEY) {
            dotenv.config({ path: path.resolve(__dirname, "../.env") });
            dotenv.config();
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                message: "GEMINI_API_KEY is not configured on the server. Please add it to backend/.env and restart your server.",
                success: false
            });
        }

        // Retrieve existing conversation or create a new one
        let conversation;
        if (conversationId) {
            conversation = await AIConversation.findOne({ _id: conversationId, userId });
        }

        if (!conversation) {
            const title = prompt.trim().slice(0, 30) + (prompt.trim().length > 30 ? "..." : "");
            conversation = await AIConversation.create({
                userId,
                title,
                messages: []
            });
        }

        // Format history for multi-turn Gemini API (last 20 messages for context)
        const contextMessages = conversation.messages.slice(-20);
        const contents = contextMessages.map(msg => ({
            role: msg.role === "model" ? "model" : "user",
            parts: [{ text: msg.text }]
        }));

        // Append latest user prompt
        contents.push({
            role: "user",
            parts: [{ text: prompt.trim() }]
        });

        // Determine candidate models to attempt
        const preferredModel = (process.env.GEMINI_MODEL || "gemini-2.5-flash").trim();
        const modelsToTry = [preferredModel, ...FALLBACK_MODELS.filter(m => m !== preferredModel)];

        const requestBody = JSON.stringify({
            contents,
            systemInstruction: {
                parts: [{
                    text: "You are IrisChat AI, a smart, friendly, and helpful AI assistant embedded in the IrisChat chat application. Provide concise, clear, and well-structured responses. Use clean formatting where helpful."
                }]
            },
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048
            }
        });

        let geminiResponse = null;
        let lastErrorData = null;

        for (const model of modelsToTry) {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: requestBody
                });

                if (response.ok) {
                    geminiResponse = response;
                    break;
                } else {
                    lastErrorData = await response.json().catch(() => ({}));
                    // If model not found (404), try the next model in the list
                    if (response.status === 404) {
                        console.warn(`Model ${model} not available (404). Trying next fallback...`);
                        continue;
                    } else {
                        // Rate limit or other direct client error
                        geminiResponse = response;
                        break;
                    }
                }
            } catch (networkErr) {
                console.error(`Network error attempting model ${model}:`, networkErr);
                return res.status(503).json({
                    message: "Failed to connect to Google Gemini service. Please check your internet connection.",
                    success: false
                });
            }
        }

        if (!geminiResponse || !geminiResponse.ok) {
            const status = geminiResponse?.status || 400;
            console.error("Gemini API Error:", status, lastErrorData);

            if (status === 429) {
                return res.status(429).json({
                    message: "Google Gemini rate limit reached. Please wait a moment and try again.",
                    success: false
                });
            } else if (status === 400 || status === 403) {
                return res.status(400).json({
                    message: lastErrorData?.error?.message || "Invalid Gemini API Key or request parameters.",
                    success: false
                });
            } else {
                return res.status(status).json({
                    message: lastErrorData?.error?.message || "Gemini API encountered an error processing your request.",
                    success: false
                });
            }
        }

        const data = await geminiResponse.json();
        const candidate = data.candidates?.[0];
        const parts = candidate?.content?.parts || [];

        // For models with thinking parts, extract text excluding internal thoughts
        const textParts = parts
            .filter(p => p.text && !p.thought)
            .map(p => p.text);
        const replyText = textParts.join("\n") || parts.map(p => p.text).filter(Boolean).join("\n");

        if (!replyText) {
            return res.status(500).json({
                message: "Received empty response from Gemini assistant.",
                success: false
            });
        }

        // Save turn to conversation
        const userMsg = {
            role: "user",
            text: prompt.trim(),
            createdAt: new Date()
        };
        const modelMsg = {
            role: "model",
            text: replyText,
            createdAt: new Date()
        };

        conversation.messages.push(userMsg);
        conversation.messages.push(modelMsg);
        await conversation.save();

        return res.status(200).json({
            success: true,
            conversationId: conversation._id,
            userMessage: userMsg,
            assistantMessage: modelMsg,
            conversation
        });

    } catch (error) {
        console.error("Error in chatWithGemini:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 2. Get all AI conversations for the logged-in user
export async function getAIConversations(req, res) {
    try {
        const userId = req.id;
        const conversations = await AIConversation.find({ userId })
            .select("title messages createdAt updatedAt")
            .sort({ updatedAt: -1 });

        return res.status(200).json({ success: true, conversations });
    } catch (error) {
        console.error("Error getting AI conversations:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 3. Get single AI conversation with full messages
export async function getAIConversationById(req, res) {
    try {
        const { id } = req.params;
        const userId = req.id;

        const conversation = await AIConversation.findOne({ _id: id, userId });
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found", success: false });
        }

        return res.status(200).json({ success: true, conversation });
    } catch (error) {
        console.error("Error getting AI conversation:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 4. Start a new AI conversation (creates a new session)
export async function startNewAIConversation(req, res) {
    try {
        const userId = req.id;
        const { title } = req.body;

        const newConversation = await AIConversation.create({
            userId,
            title: title || "New Chat",
            messages: []
        });

        return res.status(201).json({ success: true, conversation: newConversation });
    } catch (error) {
        console.error("Error creating new AI conversation:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 5. Delete an AI conversation
export async function deleteAIConversation(req, res) {
    try {
        const { id } = req.params;
        const userId = req.id;

        const deleted = await AIConversation.findOneAndDelete({ _id: id, userId });
        if (!deleted) {
            return res.status(404).json({ message: "Conversation not found", success: false });
        }

        return res.status(200).json({ success: true, message: "Conversation deleted" });
    } catch (error) {
        console.error("Error deleting AI conversation:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
