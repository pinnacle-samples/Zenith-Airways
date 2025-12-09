import { Pinnacle } from 'rcs-js';
import { rcsClient } from './rcsClient';
import 'dotenv/config';

export class BaseAgent {
  protected client: Pinnacle;
  protected agentName: string;
  protected TEST_MODE: boolean;

  constructor() {
    this.client = rcsClient;

    const agentName = process.env.PINNACLE_AGENT_NAME;
    if (!agentName) {
      throw new Error('PINNACLE_AGENT_NAME environment variable is not set');
    }
    this.agentName = agentName;

    this.TEST_MODE = process.env.TEST_MODE === 'true';
  }

  // Helper method to send text messages without strict formatting
  async sendStrictFormatMessage(to: string, text: string) {
    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      text: text,
      quickReplies: [],
      options: { test_mode: this.TEST_MODE },
    });
  }
}
