/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { PageContentHasTagRepository } from '../repositories/PageContentHasTagRepository';
import { PageContentHasTag } from '../models/PageContentHasTag';
import { SearchUtil } from '../../utils/SearchUtil';
import { Not, Equal } from 'typeorm';

@Service()
export class PageContentHasTagService {

    constructor(@OrmRepository() private pageHashTagRepository: PageContentHasTagRepository,
        @Logger(__filename) private log: LoggerInterface) {
    }

    // create page
    public async create(pageHashTag: any): Promise<PageContentHasTag> {
        this.log.info('Create a new pageHashTag => ', pageHashTag.toString());
        return this.pageHashTagRepository.save(pageHashTag);
    }

    // find one page
    public findOne(pageHashTag: any): Promise<any> {
        return this.pageHashTagRepository.findOne(pageHashTag);
    }
    // find all page
    public findAll(): Promise<any> {
        this.log.info('Find all pageHashTag');
        return this.pageHashTagRepository.find();
    }

    public findAlls(pageHashTag: any): Promise<any> {
        this.log.info('Find all pageHashTagId');
        return this.pageHashTagRepository.find(pageHashTag);
    }
    // find all page
    public findAllHasTag(pageHashTag: any): Promise<any> {
        this.log.info('Find all pageHashTagId');
        return this.pageHashTagRepository.find(pageHashTag);
    }

    // update page
    public update(pageHashTag: PageContentHasTag): Promise<any> {
        this.log.info('Update a pageHashTag');
        return this.pageHashTagRepository.createQueryBuilder().update(PageContentHasTag).set({ tagId: pageHashTag.tagId }).where('pageId = :pageId', { pageId: pageHashTag.pageId }).execute();
    }

    // page List
    public search(limit: any, offset: any, select: any = [], relation: any = [], whereConditions: any = [], orderBy: any, count: boolean, show_article?: boolean): Promise<any> {

        const newId: any[] = [];
        for(const id of whereConditions){
            newId.push(id.tagId);
        }
        if (show_article) {
            return this.pageHashTagRepository.find({
                where: {
                    tagId: Not(Equal(newId))
                }
            });
        } else {
            const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);

            if (count) {
                return this.pageHashTagRepository.count(condition);
            } else {
                return this.pageHashTagRepository.find(condition);
            }
        }

    }

    // delete page
    public async delete(id: any): Promise<any> {
        return await this.pageHashTagRepository.delete(id);
    }
}
