const serverless = require('serverless-http');
const path = require('path');

let handler;

module.exports.handler = async (event, context) => {
  if (!handler) {
    const { NestFactory } = require('@nestjs/core');
    const { ValidationPipe } = require('@nestjs/common');
    const { AppModule } = require(path.join(__dirname, '../../dist/app.module'));

    const app = await NestFactory.create(AppModule, { logger: false });
    app.setGlobalPrefix('api/v1');
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    handler = serverless(app.getHttpAdapter().getInstance());
  }

  return handler(event, context);
};
