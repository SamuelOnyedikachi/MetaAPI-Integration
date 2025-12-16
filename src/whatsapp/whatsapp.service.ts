import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AiAgentService } from './ai-agent.service';
import {
  SendWhatsappMessageDto,
  WhatsappMessageType,
} from './send-whatsapp-message.dto';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly accessToken: string;
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly aiAgentService: AiAgentService,
    private readonly configService: ConfigService,
  ) {
    const accessToken = this.configService.get<string>('META_ACCESS_TOKEN');
    const senderId = this.configService.get<string>('META_SENDER_ID');

    if (!accessToken || !senderId) {
      throw new Error(
        'Missing required environment variables: META_ACCESS_TOKEN or META_SENDER_ID',
      );
    }

    this.accessToken = accessToken;
    const metaApiUrl = this.configService.get<string>('META_API_URL');
    this.apiUrl = `${metaApiUrl}/${senderId}/messages`;
  }

  async handleIncomingMessage(payload: any): Promise<void> {
    // Extract user message and phone number from webhook payload
    // This is a sample structure, you must adapt it to the actual Meta webhook payload
    const message = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message || message.type !== 'text') {
      this.logger.warn('Received non-text message or invalid payload');
      return;
    }

    const userPhoneNumber = message.from;
    const userMessage = message.text.body;

    this.logger.log(`Received message from ${userPhoneNumber}: ${userMessage}`);

    // Get response from AI agent
    const aiResponse = await this.aiAgentService.generateResponse(userMessage);

    // Send the AI response back to the user
    const responseDto: SendWhatsappMessageDto = {
      to: userPhoneNumber,
      type: WhatsappMessageType.TEXT,
      text: { body: aiResponse },
    };

    await this.sendMessage(responseDto);
  }

  async sendMessage(dto: SendWhatsappMessageDto): Promise<void> {
    const headers = { Authorization: `Bearer ${this.accessToken}` };
    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      ...dto,
    };
    try {
      await firstValueFrom(
        this.httpService.post(this.apiUrl, body, { headers }),
      );
      this.logger.log(`Message sent successfully to ${dto.to}`);
    } catch (error) {
      this.logger.error(`Failed to send message to ${dto.to}`, error.stack);
      // Depending on your needs, you might want to throw an exception
      // to let the caller know the message failed to send.
      throw new InternalServerErrorException(
        'Failed to send WhatsApp message.',
      );
    }
  }
}
