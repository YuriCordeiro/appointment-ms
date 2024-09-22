import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  process.env.TZ = 'America/Sao_Paulo'

  const config = new DocumentBuilder()
    .setTitle('Order Manager API')
    .setDescription('This is the API from our FIAP Tech Challenge')
    .setVersion('1.0')
    //.addTag('Order-Manager')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
