import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IllustModule } from './illust/illust.module';
import { PixivApiModule } from './pixiv-api/pixiv-api.module';
import config from './config';

@Module({
  imports: [
    IllustModule,
    PixivApiModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: config.database.host,
      port: 3306,
      username: config.database.user,
      password: config.database.password,
      database: config.database.database,
      autoLoadEntities: true,
      synchronize: true, // 数据库自动同步 entity 文件修改
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
