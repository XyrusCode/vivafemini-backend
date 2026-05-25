import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';


import { AppModule } from '../src/app.module';

import type { INestApplication } from '@nestjs/common';
import type { Request, Response } from 'express';

let app: INestApplication | null = null;

async function getApp(): Promise<INestApplication> {
  if (!app) {
    app = await NestFactory.create(AppModule, { logger: false });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.enableCors({
      origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
      credentials: true,
    });
    await app.init();
  }
  return app;
}

export default async function handler(req: Request, res: Response): Promise<void> {
  const nestApp = await getApp();
  const expressApp = nestApp.getHttpAdapter().getInstance() as (
    req: Request,
    res: Response,
  ) => void;
  expressApp(req, res);
}
