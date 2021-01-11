/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { EntityRepository, Repository} from 'typeorm';
import { UserExpStatement } from '../models/UserExpStatement';

@EntityRepository(UserExpStatement)
export class UserExpStatementRepository extends Repository<UserExpStatement>  {

    public async userExp(userId: string): Promise<any>{
        const query: any = await this.manager.createQueryBuilder(UserExpStatement, 'UserExpStatement');
        query.select(['SUM(UserExpStatement.value_exp) as expcount']);
        query.where('UserExpStatement.userId = :id', {id: userId});
        console.log(query.getQuery());
        return query.getRawMany();
    }
}
