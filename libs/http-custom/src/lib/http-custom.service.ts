import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import * as FormData from 'form-data';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class HttpCustomService {
	constructor(private httpService: HttpService) {}

	async get<T>(endpoint: URL, apikey: string): Promise<T> {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apikey}`,
			},
		};

		return lastValueFrom(
			this.httpService.get<T>(endpoint.toString(), config),
		).then((response) => {
			return Promise.resolve(response.data);
		});
	}

	async post<T>(endpoint: URL, body: object, apikey?: string): Promise<T> {
		const requestConfig = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apikey}`,
			},
		};

		return lastValueFrom(
			this.httpService.post<T>(endpoint.toString(), body, requestConfig),
		)
			.then((response) => {
				return Promise.resolve(response.data);
			})
			.catch((error: Error) => {
				Logger.error(error);
				throw error;
			});
	}

	// FixMe => eso de devolver un tipo genérico no es una buena idea aquí...
	async postFormData<T>(endpoint: URL, body: FormData): Promise<T> {
		const requestConfig = {
			headers: body.getHeaders(),
		};

		return lastValueFrom(
			this.httpService.post<T>(endpoint.toString(), body, requestConfig),
		)
			.then((response) => {
				return Promise.resolve(response.data);
			})
			.catch((error: T) => {
				Logger.error(error);

				return error;
			});
	}
}
