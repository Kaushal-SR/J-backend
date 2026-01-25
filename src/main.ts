import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable cookies
  app.use(cookieParser());

  // ✅ TRUST PROXY (Railway fix)
  const server = app.getHttpAdapter().getInstance();
  server.set('trust proxy', 1);

  // ✅ CORS (local + production)
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://nihongospace.vercel.app', // <-- your deployed frontend URL
    ],
    credentials: true,
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
