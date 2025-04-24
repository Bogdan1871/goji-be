import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    console.log(`[Bootstrap] Application is running on port ${port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Application failed to start', err);
});
