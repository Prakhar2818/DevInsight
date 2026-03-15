import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: [
        'http://localhost:3000',
        'https://c38fed57.devinsight-bm7.pages.dev',

      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    });

    const port = Number(process.env.PORT || 4000);
    await app.listen(port, '0.0.0.0');

    console.log(`Server started on port ${port}`);
  } catch (error) {
    console.error('Bootstrap error:', error);
    throw error;
  }
}

bootstrap();
