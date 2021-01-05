/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';
import { Vote } from '../models/Vote';

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {

    public async countVoteLike(voteIds?: number[]): Promise<any> {
        if(voteIds === undefined || voteIds === null || voteIds.length <= 0){
            return Promise.resolve({});
        }

        const query: any = await this.manager.createQueryBuilder(Vote, 'Vote');
        query.select(['Vote.id as voteId', 'Vote.like_count as likeCount', 'Vote.dislike_count as dislikeCount', 
        '(Vote.like_count + Vote.dislike_count) as totalCount']);
        query.where('Vote.id IN (:...ids)', { ids: voteIds });
        query.orderBy('totalCount', 'DESC');

        console.log(query.getQuery());
        return query.getRawMany();
    }

}
