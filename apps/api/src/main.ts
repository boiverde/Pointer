import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: true, // Allow all origins (Store and Admin on Vercel)
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // Strip properties not in DTO
        forbidNonWhitelisted: true, // Throw error if extra properties are sent
        transform: true, // Auto-transform payloads to DTO instances
    }));
    await app.listen(process.env.PORT || 3001);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
