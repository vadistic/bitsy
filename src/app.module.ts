import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormModule } from './data/data.module';
import { MongoModule } from './mongo/mongo.module';

@Module({
  imports: [
    MongoModule.registerAsync({
      url: process.env.MONGODB_URL,
      dbName: process.env.MONGODB_NAME,
      auth: {
        user: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASS,
      },
    }),
    FormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
