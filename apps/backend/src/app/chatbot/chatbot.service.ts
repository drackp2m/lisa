import * as textToSpeech from '@google-cloud/text-to-speech';
import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';

import { HttpCustomService } from 'http-custom';

import { GptResponseDto } from './dto/gpt-response.dto';
import { WhisperResponseDto } from './dto/whisper-response.dto';
import { AudioEncoding } from './enum/audio-encoding.enum';
import { SsmlVoiceGender } from './enum/ssml-voice-gender.enum';

@Injectable()
export class ChatbotService {
	constructor(
		private readonly httpCustomService: HttpCustomService,
		private readonly configService: ConfigService,
	) {}

	async getResponse(prompt: string) {
		const apikey: string = await this.configService.get('GPT_APIKEY');
		const endpoint: string = await this.configService.get(
			'GPT_ENDPOINT_COMPLETIONS',
		);
		const url: URL = new URL(endpoint);
		const body = {
			model: 'text-davinci-003',
			prompt: prompt,
			temperature: +(await this.configService.get('GPT_TEMPERATURE')),
			max_tokens: +(await this.configService.get('GPT_MAX_TOKENS')),
		};

		try {
			const response: GptResponseDto = await this.httpCustomService.post(
				url,
				body,
				apikey,
			);

			return response.choices[0].text;
		} catch (error) {
			return `Ha habido un error: ${error.message}`;
		}
	}

	async getTextToSpeech(text: string): Promise<StreamableFile> {
		const client = new textToSpeech.TextToSpeechClient();

		let newArr = text.match(/[^.]+\./g);

		// TODO: fix this
		if (!newArr) {
			newArr = [text];
		}

		let charCount = 0;
		let textChunk = '';
		// let index = 0;

		for (let n = 0; n < newArr.length; n++) {
			charCount += newArr[n].length;
			textChunk = textChunk + newArr[n];

			if (charCount > 4600 || n == newArr.length - 1) {
				// Construct the request
				const request = {
					input: {
						text: textChunk,
					},
					// Select the language and SSML voice gender (optional)
					voice: {
						languageCode: 'es-ES',
						ssmlGender: SsmlVoiceGender.MALE,
						name: 'es-ES-Wavenet-B',
					},
					// select the type of audio encoding
					audioConfig: {
						effectsProfileId: ['headphone-class-device'],
						pitch: -2,
						speakingRate: 1.1,
						audioEncoding: AudioEncoding.MP3,
					},
				};

				Logger.log('Transforming text to audio...', 'Google TextToSpeech');

				// Performs the text-to-speech request
				const [response] = await client.synthesizeSpeech(request);

				const fileData = response.audioContent;

				// index++;
				charCount = 0;
				textChunk = '';

				Logger.log('Getting job done... =)');

				if (fileData instanceof Uint8Array) {
					return new StreamableFile(fileData);
				}
			}
		}
	}

	async uploadAudio(file): Promise<StreamableFile> {
		const formData = new FormData();

		const url: URL = new URL(
			await this.configService.get('WHISPER_ENDPOINT_TRANSCRIPT'),
		);

		formData.append('file', file.buffer, file.originalname);

		Logger.log('Transcripting audio...', 'Whisper');

		const response: WhisperResponseDto =
			await this.httpCustomService.postFormData<WhisperResponseDto>(
				url,
				formData,
			);

		const prompt = response.results[0].transcript;

		Logger.log(`Success with: ${prompt.trim()}`, 'Whisper');

		Logger.log('Getting response...', 'GPT-3');

		const chatbotResponse = await this.getResponse(prompt);

		Logger.log(`Success with: ${chatbotResponse.trim()}`, 'GPT-3');

		return this.getTextToSpeech(chatbotResponse);
	}
}
