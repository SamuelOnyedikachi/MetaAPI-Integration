import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { SendWhatsappMessageDto } from './send-whatsapp-message.dto';
import type { Response } from 'express';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappservice: WhatsappService) {}

  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const verifyToken = process.env.META_VERIFY_TOKEN;

    // Log the tokens for easier debugging
    console.log(`Received token from Meta: ${token}`);
    console.log(`Expected token from .env: ${verifyToken}`);

    if (mode && token && mode === 'subscribe' && token === verifyToken) {
      console.log('WEBHOOK_VERIFIED');
      return res.status(HttpStatus.OK).send(challenge);
    } else {
      console.error(
        'Failed validation. Make sure the validation tokens match.',
      );
      return res.sendStatus(HttpStatus.FORBIDDEN);
    }
  }

  @Post('webhook')
  async handleIncomingMessages(@Body() body: any) {
    console.log('Incoming webhook message:', JSON.stringify(body, null, 2));

    if (body.object) {
      this.whatsappservice.handleIncomingMessage(body);
    }
    return 'EVENT_RECEIVED';
  }

  @Post('send')
  async send(@Body() payload: SendWhatsappMessageDto) {
    return await this.whatsappservice.sendMessage(payload);
  }
}
