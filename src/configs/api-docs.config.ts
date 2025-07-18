import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const api_documentation_credentials = {
	name: process.env.API_DOC_USER,
	pass: process.env.API_DOC_PASS,
};
export function configSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle('Vinter project')
		.setDescription(
			'This is the API documentation for the Vinter project. It provides endpoints for authentication, speech processing, and more.',
		)
		.setVersion('1.0')
		.addSecurity('token', { type: 'http', scheme: 'bearer' })
		.build();
	const document = SwaggerModule.createDocument(app, config);

	const http_adapter = app.getHttpAdapter();
	http_adapter.use(
		'/api-docs',
		(req: Request, res: Response, next: NextFunction) => {
			function parseAuthHeader(input: string): { name: string; pass: string } {
				const [, encodedPart] = input.split(' ');

				const buff = Buffer.from(encodedPart, 'base64');
				const text = buff.toString('ascii');
				const [name, pass] = text.split(':');

				return { name, pass };
			}

			function unauthorizedResponse(): void {
				if (http_adapter.getType() === 'fastify') {
					res.statusCode = 401;
					res.setHeader('WWW-Authenticate', 'Basic');
				} else {
					res.status(401);
					res.set('WWW-Authenticate', 'Basic');
				}

				next();
			}

			if (!req.headers.authorization) {
				return unauthorizedResponse();
			}

			const credentials = parseAuthHeader(req.headers.authorization);

			if (
				credentials?.name !== api_documentation_credentials.name ||
				credentials?.pass !== api_documentation_credentials.pass
			) {
				return unauthorizedResponse();
			}

			next();
		},
	);
	SwaggerModule.setup('api-docs', app, document, {
		swaggerOptions: { persistAuthorization: true },
		customJs: '/swagger-custom.js',
		customSiteTitle: 'Vinter Documentation',
		customfavIcon: '/swagger.webp',
	});
}
