import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestFilter } from './filters/bad-request.filter';
import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new BadRequestFilter());
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Api Doc')
    .setDescription('Api Doc')
    .setVersion('1.0')
    .addTag('doc')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {});
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
