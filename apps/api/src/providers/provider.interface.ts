export interface AIProvider {
  /**
   * Generates structured JSON output from a prompt.
   */
  generateJSON(prompt: string, model: string): Promise<any>;

  /**
   * Generates free-form text content from a prompt.
   */
  generateContent(prompt: string, model: string): Promise<string>;

  /**
   * Fetches a list of available generative models supported by this provider for the current API key.
   */
  getAvailableModels(): Promise<string[]>;

  /**
   * Validates if the current API key is valid and has permissions.
   */
  validateConnection(): Promise<boolean>;
}
