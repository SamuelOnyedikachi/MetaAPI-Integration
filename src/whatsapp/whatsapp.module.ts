import { Logger, Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';

@Module({
  providers: [WhatsappService, Logger],
  controllers: [WhatsappController],
})
export class WhatsappModule {}
