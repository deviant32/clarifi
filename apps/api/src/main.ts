import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ServerlessNestjsApplicationFactory } from 'serverless-lambda-nestjs';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: '*',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  });
  const port = process.env.PORT || 3333;

  const config = new DocumentBuilder()
    .setTitle('Clarifi ASD')
    .setDescription('Quadrant Biosciences ASD API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

// Run Nestjs application locally
if (process.env.NX_CLI_SET) {
  bootstrap();
}

// Run Nestjs application in AWS Lambda
export const handler: APIGatewayProxyHandler = async (event, context) => {
  const app = new ServerlessNestjsApplicationFactory<AppModule>(
    AppModule,
    {
      // NestFactory.create's option object
      cors: {
        origin: '*',
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
      },
    }
  );

  const result = await app.run(event, context);
  return result;
};
