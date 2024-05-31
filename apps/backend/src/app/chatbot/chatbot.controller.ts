import {
	Body,
	Controller,
	Get,
	Header,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

import { ChatbotService } from './chatbot.service';
import { ChatBotRequestDto } from './dto/chat-bot-request.dto';

@Controller('chatbot')
export class ChatbotController {
	constructor(private readonly chatbotService: ChatbotService) {}

	@Post()
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				prompt: {
					type: 'string',
					format: 'utf-8',
				},
			},
		},
	})
	getReqResponse(@Body() chatBotRequestDto: ChatBotRequestDto) {
		return this.chatbotService.getResponse(chatBotRequestDto.prompt);
	}

	@Get()
	getResponse() {
		return this.chatbotService.getResponse('What is the capital of Mongolia?');
	}

	@Post('audio')
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@Header('Content-Type', 'audio/mpeg')
	@Header('Content-Disposition', 'attachment; filename=audio.mp3')
	@UseInterceptors(FileInterceptor('file'))
	async uploadAudio(@UploadedFile() file) {
		return this.chatbotService.uploadAudio(file);
	}
}
