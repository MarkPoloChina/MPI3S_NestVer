import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IllustController } from './illust/illust.controller';
import { IllustService } from './illust/illust.service';
import { IllustModule } from './illust/illust.module';

@Module({
  imports: [IllustModule],
  controllers: [AppController, IllustController],
  providers: [AppService, IllustService],
})
export class AppModule {}
