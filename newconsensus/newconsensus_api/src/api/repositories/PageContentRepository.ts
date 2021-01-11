/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { EntityRepository, Repository } from 'typeorm';
import { PageContent } from '../models/PageContent';
// import { PageContentImage } from '../models/PageContentImage';

@EntityRepository(PageContent)
export class PageContentRepository extends Repository<PageContent>  {

    public async pageContentImagesList(id: number[]): Promise<any> {
        if (id === undefined || id === null || id.length <= 0) {
            return Promise.resolve({});
        }
        const query = await this.manager.createQueryBuilder(PageContent, 'pageContent')
            .leftJoinAndSelect('page_content_image', 'pageImages', 'pageImages.page_content_id = pageContent.id')
            // .where('pageImages.page_content_id in "'+id+'" ');
            .where('pageImages.page_content_id in (:pageId) ', { pageId: id });
        // .getMany();
        return query.getRawMany();
    }
}
