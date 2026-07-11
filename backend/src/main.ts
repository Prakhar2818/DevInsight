import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Serve static files (like generated DOCX files) from the 'public' directory
    app.useStaticAssets(join(process.cwd(), 'public'));

    app.enableCors({
      origin: ['http://localhost:3000', 'https://devinsight-bm7.pages.dev', 'https://dev-insight-vb77.vercel.app'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    });

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 4000;
    await app.listen(port, '0.0.0.0');

    console.log(`Server started on port ${port}`);
  } catch (error) {
    console.error('Bootstrap error:', error);
    throw error;
  }
}

bootstrap();
