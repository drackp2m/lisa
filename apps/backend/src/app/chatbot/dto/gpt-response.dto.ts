export class GptResponseDto {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: [
		{
			text: string;
			index: number;
			logprobs: object;
			finish_reason: string;
		},
	];
	usage?: {
		prompt_tokens?: number;
		completion_tokens?: number;
		total_tokens?: number;
	};
}
