/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { EntityRepository, Repository } from 'typeorm';
import { VoteComment } from '../models/VoteComment';

@EntityRepository(VoteComment)
export class VoteCommentRepository extends Repository<VoteComment> {

    public async countComment(voteIds: number[], isApproveComment?: boolean): Promise<any> {
        if (voteIds === undefined || voteIds === null || voteIds.length <= 0) {
            return Promise.resolve({});
        }

        let approveStmt = '';
        if (isApproveComment) {
            approveStmt = ' and VoteComment.approve_user_id is not null';
        }

        const query: any = await this.manager.createQueryBuilder(VoteComment, 'VoteComment');
        query.select(['VoteComment.vote_id as voteId', 'COUNT(VoteComment.id) as count']);
        query.where('VoteComment.vote_id IN (:...ids)' + approveStmt, { ids: voteIds });
        query.groupBy('voteId');
        query.orderBy('voteId', 'DESC');
        console.log(query.getQuery());
        return query.getRawMany();
    }

    public async countCommentByValue(voteIds: number[], isApproveComment?: boolean): Promise<any> {
        if (voteIds === undefined || voteIds === null || voteIds.length <= 0) {
            return Promise.resolve({});
        }

        let approveStmt = '';
        if (isApproveComment) {
            approveStmt = ' and VoteComment.approve_user_id is not null';
        }

        const query: any = await this.manager.createQueryBuilder(VoteComment, 'VoteComment');
        query.select(['VoteComment.vote_id as voteId', 'VoteComment.value as voteValue', 'COUNT(VoteComment.id) as count']);
        query.where('VoteComment.vote_id IN (:...ids)' + approveStmt, { ids: voteIds });
        query.groupBy('voteId').addGroupBy('voteValue');
        query.orderBy('voteId', 'DESC');
        console.log(query.getQuery());
        return query.getRawMany();
    }

    public async countVoteCommentLike(voteIds?: number[], isApproveComment?: boolean): Promise<any> {
        if (voteIds === undefined || voteIds === null || voteIds.length <= 0) {
            return Promise.resolve({});
        }

        let approveStmt = '';
        if (isApproveComment) {
            approveStmt = ' and VoteComment.approve_user_id is not null';
        }

        const query: any = await this.manager.createQueryBuilder(VoteComment, 'VoteComment');
        query.select(['VoteComment.vote_id as voteId', 'SUM(VoteComment.like_count) as likeCount', 'SUM(VoteComment.dislike_count) as dislikeCount',
            'SUM(VoteComment.like_count + VoteComment.dislike_count) as totalCount',
            'COUNT(VoteComment.id) as commentCount']);
        query.groupBy('VoteComment.vote_id');
        query.where('VoteComment.vote_id IN (:...ids)' + approveStmt, { ids: voteIds });
        query.orderBy('totalCount', 'DESC');

        console.log(query.getQuery());
        return query.getRawMany();
    }

}
