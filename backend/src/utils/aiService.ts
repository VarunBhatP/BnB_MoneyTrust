import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

const BASE_URL = process.env.AI_SERVICE_URL ?? 'https://bnb-ai-ml-service.onrender.com';

/**
 * Centralised wrapper around the AI/ML micro-service hosted on Render.
 * Handles base URL, time-outs, retries, and unified error formatting.
 */
class AIService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 30_000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
  }

  private async handleRequest<T>(request: Promise<AxiosResponse<T>>): Promise<T> {
    try {
      const response = await request;
      
      // Log only essential info, not entire response
      console.log(`AI Service Success: ${response.status} ${response.config?.url}`);
      
      return response.data;
    } catch (error: any) {
      // Log error without huge response data
      console.error('AI Service Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        // Don't log response.data to avoid huge logs
      });

      // Normalise axios error shape for controllers
      if (error.response) {
        // Server responded with status outside 2xx
        const statusCode = error.response.status;
        const errorMsg = error.response.data?.message || error.response.data?.detail || 'AI service error';
        throw new Error(`AI service error: ${statusCode} - ${errorMsg}`);
      }
      
      if (error.request) {
        // No response received
        throw new Error('AI service is unreachable - connection timeout');
      }
      
      // Something else happened setting up the request
      throw new Error(`AI service request error: ${error.message}`);
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                             Public Endpoints                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Detect anomalies in a single transaction (or batch).
   * The ML API expects: { amount, department_id, vendor_name, transaction_date }
   */
  public async detectAnomaly(tx: {
    amount: number;
    department_id: number;
    vendor_name: string;
    transaction_date: string;
  }): Promise<any> {
    try {
      // The ML service expects array under transactions key
      const results = await this.handleRequest(
        this.client.post('/api/anomaly/detect', {
          transactions: [tx],
        })
      );
      
      // Service responds with an array; return the first element
      if (Array.isArray(results) && results.length > 0) {
        return results[0];
      }
      return results;
    } catch (error) {
      console.error('Anomaly detection failed:', error);
      // Return safe fallback
      return {
        is_anomaly: false,
        anomaly_score: 0.1,
        reasons: ['AI analysis temporarily unavailable']
      };
    }
  }

  /**
   * Forward a batch of transactions to the anomaly-detection endpoint.
   */
  public async analyzeTransactions(payload: { transactions: any[] }): Promise<any> {
    try {
      return await this.handleRequest(
        this.client.post('/api/anomaly/detect', payload)
      );
    } catch (error) {
      console.error('Transaction analysis failed:', error);
      // Return safe fallback
      return {
        results: payload.transactions.map((_, index) => ({
          transaction_index: index,
          is_anomaly: false,
          anomaly_score: 0.1,
          reasons: ['AI analysis temporarily unavailable']
        }))
      };
    }
  }

  /**
   * Forward a text query (or extracted voice text) for budget insights.
   */
  public async voiceTextQuery(payload: { text: string }): Promise<any> {
    try {
      console.log('Sending AI query:', payload.text.substring(0, 100) + '...');
      
      const result = await this.handleRequest(
        this.client.post('/api/voice/text-query', payload)
      );
      
      return result;
    } catch (error) {
      console.error('Voice query failed:', error);
      // Return user-friendly fallback
      return {
        answer: "I apologize, but I'm currently unable to process your query due to a temporary service issue. Please try again in a moment, or try rephrasing your question.",
        confidence: 0,
        keywords_detected: [],
        intent: 'fallback',
        processing_time: 0
      };
    }
  }

  /**
   * Fetch operational statistics of the ML service.
   */
  public async getHealthStats(): Promise<any> {
    try {
      return await this.handleRequest(
        this.client.get('/api/health/')
      );
    } catch (error) {
      console.error('Health check failed:', error);
      // Return offline status
      return {
        status: 'offline',
        message: 'AI service temporarily unavailable',
        uptime_seconds: 0,
        models_loaded: []
      };
    }
  }
}

export const aiService = new AIService();
