'use strict';
/**
 * Vercel Serverless entry-point for the VivaFemini NestJS API.
 *
 * Vercel runs `pnpm build` (nest build → tsc) before bundling this file,
 * so `../dist/src/app.module` is guaranteed to exist with full decorator
 * metadata emitted by tsc (emitDecoratorMetadata: true in tsconfig.json).
 *
 * The NestFactory instance is cached across warm invocations.
 */
const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');

let app;

async function getApp() {
  if (!app) {
    // Imported lazily so the module is only resolved after `pnpm build` runs.
    const { AppModule } = require('../dist/src/app.module');
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

module.exports = async (req, res) => {
  const nestApp = await getApp();
  const expressApp = nestApp.getHttpAdapter().getInstance();
  expressApp(req, res);
};
