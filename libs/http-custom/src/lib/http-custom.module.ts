import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { HttpCustomService } from './http-custom.service';

@Global()
@Module({
	imports: [
		HttpModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				timeout: configService.get('HTTP_TIMEOUT'),
				maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
			}),
			inject: [ConfigService],
		}),
	],
	providers: [HttpCustomService],
	exports: [HttpCustomService],
})
export class HttpCustomModule {}
