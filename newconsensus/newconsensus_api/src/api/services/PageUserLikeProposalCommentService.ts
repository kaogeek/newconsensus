/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { PageUserLikeProposalComments } from '../models/PageUserLikeProposalComments';
import { PageUserLikeProposalCommentRepository } from '../repositories/PageUserLikeProposalCommentRepository';
import { SearchUtil } from '../../utils/SearchUtil';

@Service()
export class PageUserLikeProposalCommentService {

    constructor(@OrmRepository() private repository: PageUserLikeProposalCommentRepository, @Logger(__filename) private log: LoggerInterface) {
    }

    // create ageUserLikeProposalComment
    public async create(pageUserLikeProposalComments: PageUserLikeProposalComments): Promise<PageUserLikeProposalComments> {
        this.log.info('Create a new content => ', pageUserLikeProposalComments.toString());
        return this.repository.save(pageUserLikeProposalComments);
    }

    // update ageUserLikeProposalComment
    public update(user_id: number, vote_id: number, pageUserLikeProposalComments: PageUserLikeProposalComments): Promise<PageUserLikeProposalComments> {
        this.log.info('Update a pageUserLikeProposalComments');
        pageUserLikeProposalComments.userId = user_id;
        pageUserLikeProposalComments.proposalCommentId = vote_id;
        return this.repository.save(pageUserLikeProposalComments);
    }

    // findone PageUserLikeProposal
    public findOne(conditions: any): Promise<PageUserLikeProposalComments> {
        return this.repository.findOne(conditions);
    }

    // delete PageUserLikeProposalComment
    public delete(uId: number, proposalcId: number): Promise<any> {
        return this.repository.delete({ userId: uId, proposalCommentId: proposalcId });
    }

    // delete PageUserLikeProposalComment
    public async deleteFromProposal(condition: any): Promise<any> {
        const newProposal = await this.repository.delete(condition);

        return newProposal;
    }

    // delete PageUserLikeProposalComment
    public deleteFromComment(user: any, proposalcId: number): Promise<any> {
        this.log.info('Delete a vote PageUserLikeProposalComment');

        if (proposalcId === undefined) {
            return Promise.resolve(undefined);
        }

        return this.repository.delete({ userId: user.id, proposalCommentId: proposalcId });
    }

    // ageUserLikeProposalComment List
    public search(limit: number, offset: number, select: any, relation: any, whereConditions: any, orderBy: string, count: number | boolean): Promise<any> {

        const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);

        if (count) {
            return this.repository.count(condition);
        } else {
            return this.repository.find(condition);
        }
    }

    // update PageUserLikeVoteComment
    public updateFromPoposalComment(pageUserLikeProposalComment: PageUserLikeProposalComments): Promise<PageUserLikeProposalComments> {
        this.log.info('Update a pageUserLikeVoteComment');
        this.log.info('Update a pageUserLikeVote');

        return this.repository.save(pageUserLikeProposalComment);
    }
}