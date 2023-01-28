import { Module } from '@nestjs/common';
import { Illust } from './entities/illust.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IllustController } from './illust.controller';
import { IllustService } from './illust.service';
import { Meta } from './entities/meta.entities';
import { Poly } from './entities/poly.entities';
import { RemoteBase } from './entities/remote_base.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Illust, Meta, Poly, RemoteBase])],
  providers: [IllustService, Illust, Meta, Poly, RemoteBase],
  controllers: [IllustController],
})
export class IllustModule {}
