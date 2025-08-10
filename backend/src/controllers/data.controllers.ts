import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

// This is a placeholder for a real database or data source.
// In a real app, you would fetch this from a database like PostgreSQL or MongoDB.
const PHRASAL_VERBS_DATA = [
    { id: "1", verb: "Ask out", meaning: "Birine çıkma teklif etmek", example: "He finally asked her out to dinner." },
    { id: "2", verb: "Back down", meaning: "Geri adım atmak", example: "She refused to back down." },
    { id: "3", verb: "Break down", meaning: "Arızalanmak", example: "The car broke down." },
    // Add more verbs as needed
];

// GET /api/words/daily
export const getWordOfTheDay = (req: AuthenticatedRequest, res: Response) => {
    try {
        // For now, return a static word. In a real app, you'd have logic to select one.
        const word = PHRASAL_VERBS_DATA[2];
        res.status(200).json(word);
    } catch (error: any) {
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
};

// GET /api/users/progress
export const getUserProgress = (req: AuthenticatedRequest, res: Response) => {
    try {
        // Placeholder data. In a real app, you'd fetch this for the logged-in user (req.user.id).
        const progress = {
            learnedCount: 24,
            totalCount: PHRASAL_VERBS_DATA.length,
            isFavorite: false, // This would also be user-specific
        };
        res.status(200).json(progress);
    } catch (error: any) {
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
};

// GET /api/verbs
export const getAllVerbs = (req: AuthenticatedRequest, res: Response) => {
    try {
        // Placeholder data with user-specific favorite status
        const verbsWithFavorites = PHRASAL_VERBS_DATA.map(verb => ({
            ...verb,
            isFavorite: Math.random() > 0.5 // Simulate random favorites
        }));
        res.status(200).json(verbsWithFavorites);
    } catch (error: any) {
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
};

// POST /api/verbs/:id/favorite
export const toggleFavorite = (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    console.log(`User ${req.user?.id} toggled favorite for verb ${id}`);
    // In a real app, you would update the database here.
    res.status(200).json({ success: true });
};

// POST /api/chat/correct
export const correctSentence = (req: AuthenticatedRequest, res: Response) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ message: "Mesaj içeriği boş olamaz." });
    }
    // In a real app, you would call a service like OpenAI GPT here.
    const response = {
        id: `ai-${Date.now()}`,
        corrected: `This is a corrected version of: "${message}"`,
        explanation: "This is a detailed explanation of the grammatical corrections made."
    };
    res.status(200).json(response);
};