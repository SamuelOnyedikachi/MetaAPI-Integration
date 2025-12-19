import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    // Example of how to access the token
    const apiToken = this.configService.get<string>('META_API_TOKEN');
    console.log('My Meta API Token is:', apiToken);
    return 'Hello World!';
  }
}
