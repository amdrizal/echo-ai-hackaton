import Vapi from '@vapi-ai/web';

const VAPI_PUBLIC_KEY = process.env.EXPO_PUBLIC_VAPI_PUBLIC_KEY || '';

interface VapiConfig {
  assistantId: string;
  metadata?: Record<string, any>;
}

class VapiService {
  private vapi: Vapi | null = null;
  private isInitialized = false;

  initialize() {
    if (!this.isInitialized && VAPI_PUBLIC_KEY) {
      try {
        this.vapi = new Vapi(VAPI_PUBLIC_KEY);
        this.isInitialized = true;
        console.log('Vapi initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Vapi:', error);
      }
    }
  }

  async startCall(config: VapiConfig): Promise<void> {
    if (!this.vapi) {
      throw new Error('Vapi not initialized. Call initialize() first.');
    }

    if (!config.assistantId) {
      throw new Error('Assistant ID is required to start a call');
    }

    try {
      console.log('Starting Vapi call with assistant ID:', config.assistantId);

      // Vapi Web SDK expects just the assistant ID as a string
      await this.vapi.start(config.assistantId);

      console.log('Vapi call started successfully');
    } catch (error) {
      console.error('Failed to start Vapi call:', error);
      throw error;
    }
  }

  stopCall(): void {
    if (this.vapi) {
      try {
        this.vapi.stop();
        console.log('Vapi call stopped');
      } catch (error) {
        console.error('Failed to stop Vapi call:', error);
        throw error;
      }
    }
  }

  onCallStart(callback: () => void): void {
    if (this.vapi) {
      this.vapi.on('call-start', callback);
    }
  }

  onCallEnd(callback: () => void): void {
    if (this.vapi) {
      this.vapi.on('call-end', callback);
    }
  }

  onMessage(callback: (message: any) => void): void {
    if (this.vapi) {
      this.vapi.on('message', callback);
    }
  }

  onError(callback: (error: any) => void): void {
    if (this.vapi) {
      this.vapi.on('error', callback);
    }
  }

  removeAllListeners(): void {
    if (this.vapi) {
      // Remove all event listeners
      this.vapi.removeAllListeners();
    }
  }
}

// Export singleton instance
export const vapiService = new VapiService();
export default vapiService;
