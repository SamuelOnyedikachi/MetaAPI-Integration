import { Module } from '@nestjs/common';
import { WebChatController } from './web-chat.controller';
import { AiAgentModule } from '../whatsapp/ai-agent.module';

@Module({
  imports: [AiAgentModule],
  controllers: [WebChatController],
})
export class WebChatModule {}
