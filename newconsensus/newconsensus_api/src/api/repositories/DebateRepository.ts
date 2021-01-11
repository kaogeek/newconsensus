/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { EntityRepository, Repository } from 'typeorm';
import { Debate } from '../models/Debate';

@EntityRepository(Debate)
export class DebateRepository extends Repository<Debate> {

    public async countDebateLike(debateIds?: number[]): Promise<any> {
        if(debateIds === undefined || debateIds === null || debateIds.length <= 0){
            return Promise.resolve({});
        }

        const query: any = await this.manager.createQueryBuilder(Debate, 'Debate');
        query.select(['Debate.id as debateId', 'Debate.like_count as likeCount', 'Debate.dislike_count as dislikeCount', 
        '(Debate.like_count + Debate.dislike_count) as totalCount']);
        query.where('Debate.id IN (:...ids)', { ids: debateIds });
        query.orderBy('totalCount', 'DESC');

        console.log(query.getQuery());
        return query.getRawMany();
    }

}
