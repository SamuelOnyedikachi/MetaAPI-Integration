import {
  IsString,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class WhatsappTextMessageDto {
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class WhatsappTemplateLanguageDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class WhatsappTemplateMessageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => WhatsappTemplateLanguageDto)
  language: WhatsappTemplateLanguageDto;

  // You can add 'components' here if your templates require dynamic content
  // @IsOptional()
  // components?: any[];
}

export enum WhatsappMessageType {
  TEXT = 'text',
  TEMPLATE = 'template',
  // Add other types like 'image', 'document' as needed
}

export class SendWhatsappMessageDto {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsEnum(WhatsappMessageType)
  type: WhatsappMessageType;

  @IsOptional()
  @ValidateNested()
  @ValidateIf(o => o.type === WhatsappMessageType.TEXT)
  @Type(() => WhatsappTextMessageDto)
  text?: WhatsappTextMessageDto;

  @IsOptional()
  @ValidateNested()
  @ValidateIf(o => o.type === WhatsappMessageType.TEMPLATE)
  @Type(() => WhatsappTemplateMessageDto)
  template?: WhatsappTemplateMessageDto;
}
