import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { AiAgentModule } from './ai-agent.module';

@Module({
  imports: [
    HttpModule, // Import HttpModule to make HttpService available
    AiAgentModule,
  ],
  controllers: [WhatsappController],
  providers: [WhatsappService],
})
export class WhatsappModule {}
