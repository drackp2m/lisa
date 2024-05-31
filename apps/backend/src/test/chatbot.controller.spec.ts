import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpCustomService } from 'http-custom';

import { ChatbotController } from '../app/chatbot/chatbot.controller';
import { ChatbotService } from '../app/chatbot/chatbot.service';

describe('ChatbotController', () => {
	let controller: ChatbotController;
	let configService: jest.Mocked<Partial<ConfigService>>;
	let httpCustomService: jest.Mocked<Partial<HttpCustomService>>;

	beforeEach(async () => {
		configService = {};
		httpCustomService = {};

		const module: TestingModule = await Test.createTestingModule({
			controllers: [ChatbotController],
			providers: [
				ChatbotService,
				{ provide: ConfigService, useValue: configService },
				{ provide: HttpCustomService, useValue: httpCustomService },
			],
		}).compile();

		controller = module.get<ChatbotController>(ChatbotController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
