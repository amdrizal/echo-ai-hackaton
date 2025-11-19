export interface WhatsAppSummaryData {
    userId: number;
    userName: string;
    phoneNumber: string;
    conversationSummary: string;
    goalsCreated: Array<{
        title: string;
        category: string;
    }>;
    timestamp: string;
}
export declare const triggerWhatsAppSummary: (data: WhatsAppSummaryData) => Promise<void>;
//# sourceMappingURL=pipedream.service.d.ts.map