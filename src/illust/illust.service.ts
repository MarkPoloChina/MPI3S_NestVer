import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Illust } from './entities/illust.entities';
import { Meta } from './entities/meta.entities';
import { Poly } from './entities/poly.entities';
// import { QueryHelper } from './util/queryHelper';

@Injectable()
export class IllustService {
  constructor(
    @InjectRepository(Illust)
    private readonly illustRepository: Repository<Illust>,
    @InjectRepository(Meta)
    private readonly metaRepository: Repository<Meta>,
    @InjectRepository(Poly)
    private readonly polyRepository: Repository<Poly>,
  ) {}

  async getPixivEnum(row: string, desc: boolean) {
    const results: any[] = await this.metaRepository
      .createQueryBuilder('meta')
      .select(row)
      .addSelect('COUNT(*)', 'count')
      .where(':row IS NOT NULL', { row: row })
      .groupBy(row)
      .orderBy(row, desc ? 'DESC' : 'ASC')
      .getRawMany();
    return results;
  }

  async getIllustEnum(row: string, desc: boolean, requiredType?: string) {
    let queryBuilder = this.illustRepository
      .createQueryBuilder()
      .select(row)
      .addSelect(`COUNT(${row})`, 'count')
      .where(`${row} IS NOT NULL`);
    if (requiredType) {
      queryBuilder = queryBuilder.andWhere('type = :type', {
        type: requiredType,
      });
    }
    const results: any[] = await queryBuilder
      .groupBy(row)
      .orderBy(row, desc ? 'DESC' : 'ASC')
      .getRawMany();
    return results;
  }

  async getIllustListByStdQuery(
    conditionJson: string,
    limit?: number,
    offset?: number,
    orderAs?: string,
    orderDesc?: boolean,
  ) {
    let querybuilder: SelectQueryBuilder<Illust> = this.illustRepository
      .createQueryBuilder()
      .leftJoinAndSelect('Illust.meta', 'meta')
      .leftJoinAndSelect('Illust.poly', 'poly')
      .where('Illust.id IS NOT NULL');
    // const testObj = {
    //   // 'meta.page': [10, 20],
    //   'meta.pid': [10081533],
    //   'poly.type': ['test2'],
    // };
    // conditionJson = JSON.stringify(testObj);
    const conditionObj = JSON.parse(conditionJson);
    Object.keys(conditionObj).forEach((colName, index) => {
      if (conditionObj[colName].length >= 1)
        querybuilder = querybuilder.andWhere(
          `(${colName} IN (:...row${index}))`,
          {
            [`row${index}`]: conditionObj[colName],
          },
        );
    });
    const results = await querybuilder
      .orderBy(orderAs, orderDesc ? 'DESC' : 'ASC')
      .addOrderBy('meta.page', 'ASC')
      .skip(offset)
      .take(limit)
      .getMany();
    return results;
  }

  async getIllustListCountByStdQuery(conditionJson: string) {
    let querybuilder: SelectQueryBuilder<Illust> = this.illustRepository
      .createQueryBuilder()
      .select('COUNT(Illust.id)', 'count')
      .leftJoin('Illust.meta', 'meta')
      .leftJoin('Illust.poly', 'poly')
      .where('Illust.id IS NOT NULL');
    const conditionObj = JSON.parse(conditionJson);
    Object.keys(conditionObj).forEach((colName, index) => {
      if (conditionObj[colName].length >= 1)
        querybuilder = querybuilder.andWhere(
          `(${colName} IN (:...row${index}))`,
          {
            [`row${index}`]: conditionObj[colName],
          },
        );
    });
    const results = await querybuilder.getRawOne();
    // dont use getCount()!! That will query and transfer all data that is too large.
    return results;
  }
  // async getIllustList(
  //   conditionJson: string,
  //   limit?: number,
  //   offset?: number,
  //   orderAs?: string,
  //   orderDesc?: boolean,
  // ) {
  //   const conditionCartesianProd =
  //     QueryHelper.getConditionCartesianProd(conditionJson);
  //   const results: any[] = await this.illustRepository.find({
  //     where: conditionCartesianProd,
  //     relations: {
  //       meta: true,
  //     },
  //     skip: offset,
  //     take: limit,
  //     order: orderAs
  //       ? {
  //           [orderAs]: orderDesc ? 'DESC' : 'ASC',
  //         }
  //       : null,
  //   });
  //   return results;
  // }
  async getPolyList(withIllust: boolean, type: string) {
    const result = await this.polyRepository.find({
      where: type
        ? {
            type: type,
          }
        : {},
      relations: withIllust
        ? {
            illusts: {
              meta: true,
            },
          }
        : {},
      order: {
        parent: 'ASC',
        name: 'ASC',
        illusts: {
          meta: {
            pid: 'ASC',
            page: 'DESC',
          },
        },
      },
    });
    return result;
  }

  async newIllust() {
    // for (let i = 0; i < 66647; i++)
    //   this.illustRepository.insert({ type: 'pixiv' });
    // const list: Meta[] = await this.getPixivList({});
    // list.forEach((meta) => {
    //   if (meta.date && ) {
    //     this.illustRepository.update(
    //       { id: meta.illust.id },
    //       { date: meta.date },
    //     );
    //   }
    // });
    // const test = new Poly();
    // test.parent = 'picolt-1';
    // test.name = '2';
    // test.type = 'picolt';
    // test.illusts = [];
    // const json = require('../../meta.json');
    // for (const item of json.meta)
    //   if (item.copy && item.copy.length >= 1) {
    //     if (item.copy[0].copyLevel == 'picolt-1' && item.copy[0].copyNo == 2)
    //       test.illusts.push(
    //         ...(await this.illustRepository.find({
    //           where: [
    //             {
    //               meta: {
    //                 pid: parseInt(item.sid),
    //                 page: parseInt(item.page),
    //               },
    //             },
    //           ],
    //         })),
    //       );
    //   }
    // // console.log(test);
    // this.polyRepository.save(test);
  }
}
