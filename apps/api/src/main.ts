import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3002'], // Restrict to known frontends (Store and Admin)
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // Strip properties not in DTO
        forbidNonWhitelisted: true, // Throw error if extra properties are sent
        transform: true, // Auto-transform payloads to DTO instances
    }));
    await app.listen(3001);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
