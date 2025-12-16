import { IsNotEmpty, IsString } from 'class-validator';

export class WebChatMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
