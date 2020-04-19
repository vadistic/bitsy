import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FormModule } from './form/form.module';

@Module({
  imports: [
    DatabaseModule.registerAsync({
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
