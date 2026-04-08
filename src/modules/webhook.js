/**
 * Webhook operations module
 * Contains methods for managing webhook subscriptions
 */
export class WebhookMethods {
  /**
   * Create WebhookMethods instance
   * @param {Object} client - The RgbApiClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * List all webhook subscriptions
   * @returns {Promise<import('../types').WebhookListResponse>} List of webhook subscriptions
   */
  async listWebhooks() {
    return this.client._request('get', '/webhook/list');
  }

  /**
   * Subscribe to webhook events
   * @param {Object} data - Request data
   * @param {string} data.url - Webhook endpoint URL
   * @param {string[]} data.events - Event types to subscribe to (e.g. ['ReceivedSuccess', 'PaymentSuccess', 'PaymentFailed'])
   * @param {string} [data.secret] - Optional webhook secret for signature verification
   * @returns {Promise<import('../types').WebhookSubscribeResponse>} Subscription response with subscription_id
   */
  async subscribeWebhook(data) {
    return this.client._request('post', '/webhook/subscribe', data);
  }

  /**
   * Unsubscribe from webhook events
   * @param {Object} data - Request data
   * @param {string} data.subscription_id - The subscription ID to cancel
   * @returns {Promise<import('../types').EmptyResponse>} Resolves when unsubscribed
   */
  async unsubscribeWebhook(data) {
    return this.client._request('post', '/webhook/unsubscribe', data);
  }
}
