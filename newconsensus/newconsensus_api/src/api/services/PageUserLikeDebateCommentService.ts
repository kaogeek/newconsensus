/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { PageUserLikeDebateComment } from '../models/PageUserLikeDebateComment';
import { PageUserLikeDebateCommentRepository } from '../repositories/PageUserLikeDebateCommentRepository';
import { SearchUtil } from '../../utils/SearchUtil';
import { SearchFilter } from '../controllers/requests/SearchFilterRequest';

@Service()
export class PageUserLikeDebateCommentService {

    constructor(@OrmRepository() private repository: PageUserLikeDebateCommentRepository) {
    }

    // create PageUserLikeDebateComment
    public async create(pageUserLikeDebateComment: PageUserLikeDebateComment): Promise<PageUserLikeDebateComment> {
        if (pageUserLikeDebateComment.isLike) {
            pageUserLikeDebateComment.isLike = true;
        } else {
            pageUserLikeDebateComment.isLike = false;
        }

        return this.repository.save(pageUserLikeDebateComment);
    }

    // update PageUserLikeDebateComment
    public update(pageUserLikeDebateComment: PageUserLikeDebateComment): Promise<PageUserLikeDebateComment> {
        return this.repository.save(pageUserLikeDebateComment);
    }

    // findone PageUserLikeDebateComment
    public findOne(pageUserLikeDebateComment: any): Promise<any> {
        return this.repository.findOne(pageUserLikeDebateComment);
    }

    // delete PageUserLikeDebateComment
    public delete(uId: number, dbId: number): Promise<any> {
        return this.repository.delete({ userId: uId, debateCommentId: dbId });
    }

    // PageUserLikeDebateComment List
    public search(searchFilter: SearchFilter): Promise<any> {

        const condition: any = SearchUtil.createFindCondition(searchFilter.limit, searchFilter.offset, searchFilter.select, searchFilter.relation, searchFilter.whereConditions, searchFilter.orderBy);

        if (searchFilter.count) {
            return this.repository.count(condition);
        } else {
            return this.repository.find(condition);
        }
    }

    // find PageUserLikeDebateComment
    public find(pageUserLikeDebateComment: any): Promise<any> {
        return this.repository.find(pageUserLikeDebateComment);
    }
}