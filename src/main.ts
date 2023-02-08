import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common/pipes'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      /**
       * [ INI ]
       * las sgtes opciones ayudan a la tranformación pero
       * consumen un poco mas la memoria ya que haran la transformación
       * por debajo.
       */
      transform: true,
      transformOptions: {
        enableCircularCheck: true
      }
      // [ FIN ]
    })
  )

  await app.listen(3000);
}
bootstrap();
