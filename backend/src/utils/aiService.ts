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
      timeout: 10_000, // 10 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private async handleRequest<T>(request: Promise<AxiosResponse<T>>): Promise<T> {
    try {
      const response = await request;
      return response.data;
    } catch (error: any) {
      // Normalise axios error shape for controllers
      if (error.response) {
        // Server responded with status outside 2xx
        throw new Error(
          `AI service error: ${error.response.status} ${JSON.stringify(error.response.data)}`
        );
      }
      if (error.request) {
        // No response received
        throw new Error('AI service is unreachable.');
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
   * The ML API expects: { amount, description, date, vendor }
   */
  public async detectAnomaly(tx: {
    amount: number;
    department_id: number;
    vendor_name: string;
    transaction_date: string;
  }): Promise<any> {
    // The ML service expects array under `transactions` key and returns an array of results
    const results = await this.handleRequest(
      this.client.post('/api/anomaly/detect', {
        transactions: [tx],
      })
    );

    // Service responds with an array; return the first element for single-transaction use-case
    if (Array.isArray(results) && results.length > 0) {
      return results[0];
    }
    return results;
  }

  /**
   * Forward a batch of transactions to the anomaly-detection endpoint.
   * Expects the same payload shape the ML service requires, e.g.
   * { transactions: [ { amount, department_id, vendor_name, transaction_date } ] }
   */
  public async analyzeTransactions(payload: { transactions: any[] }): Promise<any> {
    return this.handleRequest(
      this.client.post('/api/anomaly/detect', payload)
    );
  }

  /**
   * Forward a text query (or extracted voice text) for budget insights.
   */
  public async voiceTextQuery(payload: { text: string }): Promise<any> {
    return this.handleRequest(
      this.client.post('/api/voice/text-query', payload)
    );
  }

  /**
   * Fetch operational statistics of the ML service.
   */
  public async getHealthStats(): Promise<any> {
    return this.handleRequest(
      this.client.get('/api/health/')
    );
  }
}

export const aiService = new AIService();