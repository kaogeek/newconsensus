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
import { PageUserLikeProposal } from '../models/PageUserLikeProposal';
import { PageUserLikeProposalRepository } from '../repositories/PageUserLikeProposalRepository';
import { SearchUtil } from '../../utils/SearchUtil';

@Service()
export class PageUserLikeProposalService {

    constructor(@OrmRepository() private repository: PageUserLikeProposalRepository, @Logger(__filename) private log: LoggerInterface) {
    }

    // create PageUserLikeProposal
    public async create(pageUserLikeProposal: PageUserLikeProposal): Promise<PageUserLikeProposal> {
        this.log.info('Create a new content => ', pageUserLikeProposal.toString());
        return this.repository.save(pageUserLikeProposal);
    }

    // update PageUserLikeProposal
    public update(user_id: number, proposal_id: number, pageUserLikeProposal: PageUserLikeProposal): Promise<PageUserLikeProposal> {
        this.log.info('Update a pageUserLike');
        pageUserLikeProposal.userId = user_id;
        pageUserLikeProposal.proposalId = proposal_id;
        return this.repository.save(pageUserLikeProposal);
    }

    // findone PageUserLikeProposal
    public findOne(content: any): Promise<any> {
        return this.repository.findOne(content);
    }

    // delete PageUserLikeProposal
    public delete(uId: number, pId: number): Promise<any> {
        this.log.info('Delete a like');

        // const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);
        return this.repository.delete({ userId: uId, proposalId: pId });
    }

      // delete PageUserLikeProposal
      public deleteFromProposal(pId: number): Promise<any> {
        this.log.info('Delete a like');

        // const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);
        return this.repository.delete({proposalId: pId });
    }

        // delete PageUserLikeProposal
        public deletes(condition: any): Promise<any> {
            this.log.info('Delete a like');
    
            // const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);
            return this.repository.delete(condition);
        }

    // PageUserLikeProposal List
    public search(limit: number, offset: number, select: any, relation: any, whereConditions: any, orderBy: string, count: number | boolean): Promise<any> {

        const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);

        if (count) {
            return this.repository.count(condition);
        } else {
            return this.repository.find(condition);
        }
    }

    // find PageUserLikeProposal
    public find(content: any): Promise<any> {
        return this.repository.find(content);
    }

    // update PageUserLikeVote
    public async updateFromProposal(data: PageUserLikeProposal): Promise<PageUserLikeProposal> {
        this.log.info('Update a pageUserLikeVote');

        return this.repository.save(data);
    }
}
