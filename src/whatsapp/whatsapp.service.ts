import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import {
  SendWhatsappMessageDto,
  WhatsappMessageType,
} from './send-whatsapp-message.dto';

@Injectable()
export class WhatsappService {
  private token: string;
  private phoneNumberId: string;
  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private readonly logger: Logger,
  ) {
    this.token = this.config.get<string>('META_TOKEN')!;
    this.phoneNumberId = this.config.get<string>('PHONE_NUMBER_ID')!;
    this.apiUrl = this.config.get<string>('META_API_URL')!;
  }

  async sendMessage(payload: SendWhatsappMessageDto) {
    const url = `${this.apiUrl}/${this.phoneNumberId}/messages`;
    const data: any = {
      messaging_product: 'whatsapp',
      to: payload.to,
      type: payload.type,
    };

    if (payload.type === WhatsappMessageType.TEXT && payload.text) {
      data.text = payload.text;
    } else if (
      payload.type === WhatsappMessageType.TEMPLATE &&
      payload.template
    ) {
      data.template = payload.template;
    } else {
      this.logger.error('Invalid message payload for type', payload);
      throw new Error(
        'Invalid message payload: type and corresponding data are required.',
      );
    }

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        // Changed 'to' to 'payload.to' for consistency
        `Error sending message to ${payload.to}: ${axiosError.message}`,
        axiosError.stack,
      );
      throw new Error(`Failed to send message to ${payload.to}`);
    }
  }

  async handleIncomingMessage(body: any): Promise<void> {
    try {
      const message = body.entry[0].changes[0].value.messages[0];
      const from = message.from;
      const msgBody = message.text.body;
      await this.sendMessage({
        // Updated call to sendMessage
        to: from,
        type: WhatsappMessageType.TEXT,
        text: { body: msgBody },
      });
    } catch (error) {
      this.logger.error('Error handling incoming message', error.stack);
    }
  }
}
