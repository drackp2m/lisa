import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HttpCustomModule } from 'http-custom';

import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';

@Module({
	imports: [ConfigModule, HttpCustomModule],
	controllers: [ChatbotController],
	providers: [ChatbotService],
})
export class ChatbotModule {}
