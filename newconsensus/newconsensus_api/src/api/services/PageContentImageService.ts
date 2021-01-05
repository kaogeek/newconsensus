/*
 * NewConsensus API
 * version 2.2
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { SearchUtil } from '../../utils/SearchUtil';
import { PageContentImageRepository } from '../repositories/PageContentImageRepository';
import { PageContentImage } from '../models/PageContentImage';

@Service()
export class PageContentImageService {

    constructor(@OrmRepository() private pageImageRepository: PageContentImageRepository,
                @Logger(__filename) private log: LoggerInterface) {
    }

    // find one condition
    public findOne(pages: any): Promise<any> {
        return this.pageImageRepository.findOne(pages);
    }

    // find all pageContentImage
    public findAll(): Promise<any> {
        this.log.info('Find all pageContentImage');
        return this.pageImageRepository.find();
    }

    public findAlls(pages: any): Promise<any> {
        this.log.info('Find all pageContentImageId');
        return this.pageImageRepository.find(pages);
    }

    // pageContentImage list
    public search(limit: number, offset: number, select: any = [], relation: any[], whereConditions: any = [], orderBy: any, count: boolean): Promise<any> {
      
        const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);
        if (count) {
            return this.pageImageRepository.count(condition);
        } else {
            return this.pageImageRepository.find(condition);
        }
    }

    // create pageContentImage
    public async create(pages: PageContentImage): Promise<any> {
        this.log.info('Create a new pagecontent image');
        return this.pageImageRepository.save(pages);
    }

    // update pageContentImage
    public update(pageImages: PageContentImage): Promise<any> {
        this.log.info('Update a pageContentImage');
        // pageImages.id = id;
        // console.log('sss > '+id);
        return this.pageImageRepository.save(pageImages);
    }

    // delete pageContentImage
    public async delete(id: any): Promise<any> {
        this.log.info('Delete a pageContentImage');
        const newSettings = await this.pageImageRepository.delete(id);
        return newSettings;
    }

    public loopDataImage(pageEdit: any): any{
        for (const data of pageEdit.pageImages) {
            const result = data.id;
            return result;
        }

    }
}
