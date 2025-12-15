import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';


@Controller('whatsapp')
export class WhatsappController {
    constructor(private readonly whatsappservice: WhatsappService){}

    @Post('send')
    async send(@Body()body: { to : string; message: string }){
        return
        this.whatsappservice.sendMessage(body.to, body.message);
    }
}
