import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpCustomService } from 'http-custom';

import { ChatbotService } from '../app/chatbot/chatbot.service';

describe('ChatbotService', () => {
	let service: ChatbotService;
	let configService: jest.Mocked<Partial<ConfigService>>;
	let httpCustomService: jest.Mocked<Partial<HttpCustomService>>;

	beforeEach(async () => {
		configService = {};
		httpCustomService = {};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ChatbotService,
				{ provide: ConfigService, useValue: configService },
				{ provide: HttpCustomService, useValue: httpCustomService },
			],
		}).compile();

		service = module.get<ChatbotService>(ChatbotService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
