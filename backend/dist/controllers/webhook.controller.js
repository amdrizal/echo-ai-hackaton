"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vapiConversationEndHandler = void 0;
const goal_model_1 = require("../models/goal.model");
const user_model_1 = require("../models/user.model");
const pipedream_service_1 = require("../services/pipedream.service");
// Simple goal extraction from transcript using keywords
const extractGoalsFromTranscript = (transcript, summary) => {
    const goals = [];
    // Very simple extraction - in production, use AI/NLP
    const goalKeywords = [
        'I want to',
        'My goal is',
        'I need to',
        'I plan to',
        'I will',
    ];
    const categoryMap = {
        spanish: 'education',
        learn: 'education',
        study: 'education',
        exercise: 'health',
        gym: 'health',
        fitness: 'health',
        healthy: 'health',
        project: 'career',
        business: 'career',
        work: 'career',
        job: 'career',
        save: 'financial',
        money: 'financial',
        invest: 'financial',
    };
    // Extract from summary if available
    const text = summary || transcript;
    const sentences = text.split(/[.!?]/);
    for (const sentence of sentences) {
        for (const keyword of goalKeywords) {
            if (sentence.toLowerCase().includes(keyword.toLowerCase())) {
                // Extract goal title
                const titleMatch = sentence.match(new RegExp(keyword + '(.+)', 'i'));
                if (titleMatch) {
                    const title = titleMatch[1].trim().substring(0, 200);
                    // Determine category based on keywords
                    let category = 'personal';
                    for (const [kw, cat] of Object.entries(categoryMap)) {
                        if (sentence.toLowerCase().includes(kw)) {
                            category = cat;
                            break;
                        }
                    }
                    goals.push({
                        title,
                        description: sentence.trim(),
                        category,
                    });
                }
            }
        }
    }
    // If no goals extracted, create a default one from summary
    if (goals.length === 0 && summary) {
        goals.push({
            title: summary.substring(0, 200),
            description: summary,
            category: 'personal',
        });
    }
    return goals;
};
const vapiConversationEndHandler = async (req, res) => {
    try {
        const payload = req.body;
        console.log('Received Vapi webhook:', {
            callId: payload.call.id,
            userId: payload.metadata?.userId,
        });
        // Validate payload
        if (!payload.metadata?.userId) {
            return res.status(400).json({
                success: false,
                error: 'Missing userId in metadata',
            });
        }
        const userId = parseInt(payload.metadata.userId);
        const user = await (0, user_model_1.findUserById)(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }
        // Extract goals from conversation
        const extractedGoals = extractGoalsFromTranscript(payload.transcript, payload.summary);
        console.log('Extracted goals:', extractedGoals);
        // Create goals in database
        const createdGoals = [];
        for (const goalData of extractedGoals) {
            const goal = await (0, goal_model_1.createGoal)({
                userId,
                title: goalData.title,
                description: goalData.description,
                category: goalData.category,
                createdFromVoice: true,
                vapiConversationId: payload.call.id,
            });
            createdGoals.push(goal);
        }
        // Trigger WhatsApp notification via Pipedream (if phone number available)
        if (user.phone_number && createdGoals.length > 0) {
            await (0, pipedream_service_1.triggerWhatsAppSummary)({
                userId: user.id,
                userName: user.full_name,
                phoneNumber: user.phone_number,
                conversationSummary: payload.summary || 'Goals discussed in voice session',
                goalsCreated: createdGoals.map((g) => ({
                    title: g.title,
                    category: g.category,
                })),
                timestamp: new Date().toISOString(),
            });
        }
        return res.status(200).json({
            success: true,
            data: {
                goalsCreated: createdGoals.map((g) => ({
                    id: g.id,
                    title: g.title,
                    category: g.category,
                })),
                conversationSaved: true,
                whatsappTriggered: !!user.phone_number,
            },
        });
    }
    catch (error) {
        console.error('Vapi webhook error:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error processing webhook',
        });
    }
};
exports.vapiConversationEndHandler = vapiConversationEndHandler;
//# sourceMappingURL=webhook.controller.js.map