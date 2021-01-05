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
import { PageUserLikeVote } from '../models/PageUserLikeVote';
import { PageUserLikeVoteRepository } from '../repositories/PageUserLikeVoteRepository';
import { SearchUtil } from '../../utils/SearchUtil';

@Service()
export class PageUserLikeVoteService {

    constructor(@OrmRepository() private repository: PageUserLikeVoteRepository, @Logger(__filename) private log: LoggerInterface) {
    }

    // create PageUserLikeVote
    public async create(pageUserLikeVote: PageUserLikeVote): Promise<PageUserLikeVote> {

        if(pageUserLikeVote.isLike){
            pageUserLikeVote.isLike = true;
        } else {
            pageUserLikeVote.isLike = false;
        }

        this.log.info('Create PageUser Like Vote');

        return this.repository.save(pageUserLikeVote);
    }

    // update PageUserLikeVote
    public async update(data: PageUserLikeVote): Promise<PageUserLikeVote> {
        
        this.log.info('Update PageUser Like Vote');

        return this.repository.save(data);
    }

    // findone PageUserLikeVote
    public findOne(content: any): Promise<PageUserLikeVote> {
        return this.repository.findOne(content);
    }

    // delete PageUserLikeVote
    public delete(pUserId: number, pVoteId: number): Promise<any> {
        this.log.info('Delete PageUser Like Vote');

        if(pUserId !== null && pUserId !== undefined){
            return this.repository.delete({userId: pUserId, voteId: pVoteId});
        } else {
            return this.repository.delete({voteId: pVoteId});
        }
    }
    // PageUserLikeVote List
    public search(limit: number, offset: number, select: any, relation: any, whereConditions: any, orderBy: string, count: number | boolean): Promise<any> {

        const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);

        if (count) {
            return this.repository.count(condition);
        } else {
            return this.repository.find(condition);
        }
    }

    // find PageUserLikeVote
    public find(content: any): Promise<any> {
        return this.repository.find(content);
    }
}
