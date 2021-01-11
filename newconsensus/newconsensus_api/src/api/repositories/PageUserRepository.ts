/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { EntityRepository, Repository } from 'typeorm';
import { PageUser } from '../models/PageUser';

@EntityRepository(PageUser)
export class PageUserRepository extends Repository<PageUser>  {

    public async TodayCustomerCount(todaydate: string): Promise<any> {

        const query: any = await this.manager.createQueryBuilder(PageUser, 'pageuser');
        query.select([  'COUNT(pageuser.id) as customerCount']);
        query.where('DATE(pageuser.createdDate) = :todaydate', {todaydate});
        return query.getRawOne();
    }
}
