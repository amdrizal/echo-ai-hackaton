"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerWhatsAppSummary = void 0;
const axios_1 = __importDefault(require("axios"));
const PIPEDREAM_WEBHOOK_URL = process.env.PIPEDREAM_WEBHOOK_URL;
const triggerWhatsAppSummary = async (data) => {
    try {
        if (!PIPEDREAM_WEBHOOK_URL) {
            console.warn('PIPEDREAM_WEBHOOK_URL not configured, skipping WhatsApp notification');
            return;
        }
        await axios_1.default.post(PIPEDREAM_WEBHOOK_URL, data, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 5000,
        });
        console.log('WhatsApp summary triggered for user:', data.userId);
    }
    catch (error) {
        console.error('Failed to trigger WhatsApp summary:', error);
        // Don't throw - non-critical feature
    }
};
exports.triggerWhatsAppSummary = triggerWhatsAppSummary;
//# sourceMappingURL=pipedream.service.js.map