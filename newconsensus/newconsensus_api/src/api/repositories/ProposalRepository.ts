/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { EntityRepository, Repository } from 'typeorm';
import { Proposal } from '../models/Proposal';

@EntityRepository(Proposal)
export class ProposalRepository extends Repository<Proposal>  {

    public async countProposalLike(proposalIds?: number[]): Promise<any> {
        if(proposalIds === undefined || proposalIds === null || proposalIds.length <= 0){
            return Promise.resolve({});
        }

        const query: any = await this.manager.createQueryBuilder(Proposal, 'Proposal');
        query.select(['Proposal.id as proposalId', 'Proposal.like_count as likeCount', 'Proposal.dislike_count as dislikeCount', 
        '(Proposal.like_count + Proposal.dislike_count) as totalCount']);
        query.where('Proposal.id IN (:...ids)', { ids: proposalIds });
        query.orderBy('totalCount', 'DESC');

        console.log(query.getQuery());
        return query.getRawMany();
    }

}
