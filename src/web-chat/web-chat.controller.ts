import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AiAgentService } from '../whatsapp/ai-agent.service';
import { WebChatMessageDto } from './web-chat.dto';

@Controller('web-chat')
export class WebChatController {
  private readonly logger = new Logger(WebChatController.name);

  constructor(private readonly aiAgentService: AiAgentService) {}

  @Post()
  async handleChatMessage(
    @Body() webChatMessageDto: WebChatMessageDto,
  ): Promise<{ reply: string }> {
    this.logger.log(`Received web message: "${webChatMessageDto.message}"`);
    const aiResponse = await this.aiAgentService.generateResponse(
      webChatMessageDto.message,
    );
    return { reply: aiResponse };
  }
}
