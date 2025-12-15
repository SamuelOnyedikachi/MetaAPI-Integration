import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private token: string;
  private phoneNumberId: string;
  private apiUrl: string;

  constructor(private config: ConfigService) {
    this.token = this.config.get<string>('META_TOKEN')!;
    this.phoneNumberId = this.config.get<string>('PHONE_NUMBER_ID')!;
    this.apiUrl = this.config.get<string>('META_API_URL')!;
  }

  async sendMessage(to: string, message: string) {
    const url = `${this.apiUrl}/${this.phoneNumberId}/messages`;

    return axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to,
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
