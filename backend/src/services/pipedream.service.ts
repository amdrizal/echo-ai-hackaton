import axios from 'axios';

const PIPEDREAM_WEBHOOK_URL = process.env.PIPEDREAM_WEBHOOK_URL!;

export interface WhatsAppSummaryData {
  userId: number;
  userName: string;
  phoneNumber: string;
  conversationSummary: string;
  goalsCreated: Array<{ title: string; category: string }>;
  timestamp: string;
}

export const triggerWhatsAppSummary = async (data: WhatsAppSummaryData): Promise<void> => {
  try {
    if (!PIPEDREAM_WEBHOOK_URL) {
      console.warn('PIPEDREAM_WEBHOOK_URL not configured, skipping WhatsApp notification');
      return;
    }

    await axios.post(PIPEDREAM_WEBHOOK_URL, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });

    console.log('WhatsApp summary triggered for user:', data.userId);
  } catch (error) {
    console.error('Failed to trigger WhatsApp summary:', error);
    // Don't throw - non-critical feature
  }
};
