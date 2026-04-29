import { Module } from '@nestjs/common';

import { databaseProviders } from './database.providers';
import { entitiesProviders } from './entities.providers';

@Module({
  providers: [...databaseProviders, ...entitiesProviders],
  exports: [...databaseProviders, ...entitiesProviders],
})
export class DatabaseModule {}
