import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

let cachedServer: any;

async function bootstrap() {
    if (!cachedServer) {
        const expressApp = express();
        const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

        app.enableCors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        });
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));

        await app.init();
        cachedServer = expressApp;
    }
    return cachedServer;
}

export default async function handler(req: any, res: any) {
    const server = await bootstrap();
    server(req, res);
}
