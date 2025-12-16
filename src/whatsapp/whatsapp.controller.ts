import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { ConfigService } from '@nestjs/config';

@Controller('whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);
  private readonly verifyToken: string;

  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly configService: ConfigService,
  ) {
    this.verifyToken = this.configService.get<string>('META_VERIFY_TOKEN')!;
  }

  // Webhook verification endpoint
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ): string {
    this.logger.log('Webhook verification request received.');
    if (mode !== 'subscribe' || token !== this.verifyToken) {
      throw new ForbiddenException('Webhook verification failed.');
    }
    this.logger.log('Webhook verified successfully!');
    return challenge;
  }

  // Handles incoming messages from users
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  handleIncomingMessage(@Body() body: any): void {
    this.logger.log('Incoming message payload:', JSON.stringify(body));
    // The API call is asynchronous, but Meta doesn't wait for a response.
    // We return 200 OK immediately and process the message in the background.
    this.whatsappService.handleIncomingMessage(body);
  }
}
