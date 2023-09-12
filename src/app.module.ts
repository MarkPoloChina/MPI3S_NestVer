import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IllustModule } from './illust/illust.module';
import { PixivApiModule } from './pixiv-api/pixiv-api.module';

@Module({
  imports: [
    IllustModule,
    PixivApiModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'test.db',
      autoLoadEntities: true,
      synchronize: true, // 数据库自动同步 entity 文件修改
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
