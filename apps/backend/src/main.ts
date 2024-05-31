import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors();

	const config = new DocumentBuilder()
		.setTitle('Lisa app')
		.setDescription('The lisa app description')
		.setVersion('1.0')
		.addTag('Artificial Inteligence')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('doc', app, document);

	await app.listen(3000);
}
bootstrap()
	.then(() => {
		const protocol = 'http';
		const domain = 'localhost';
		const port = 4230;
		const globalPrefix = '';
		const playgroundUrl = `${protocol}://${domain}:${port}${globalPrefix}/doc`;

		Logger.log(
			`🚀 API ready at ${playgroundUrl}, started in ${process
				.uptime()
				.toFixed(3)}s`,
			'Bootstrap',
		);
	})
	.catch((e) => Logger.error(e.message, e));
