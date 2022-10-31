import { Module } from '@nestjs/common';
import { Illust } from './entities/illust.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IllustController } from './illust.controller';
import { IllustService } from './illust.service';
import { Meta } from './entities/meta.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Illust, Meta])],
  providers: [IllustService, Illust, Meta],
  controllers: [IllustController],
})
export class IllustModule {}
