import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

@Injectable()
export class AiAgentService {
  private model: GenerativeModel;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error('Missing required environment variable: GOOGLE_API_KEY');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      return text.trim();
    } catch (error) {
      console.error('Error generating AI response from Google:', error);
      // Handle potential safety blocks from the API
      if (error instanceof Error && error.message.includes('SAFETY')) {
        return 'My safety settings prevented me from generating a response to that prompt.';
      }
      return 'Sorry, I am having trouble connecting to my brain right now.';
    }
  }
}
