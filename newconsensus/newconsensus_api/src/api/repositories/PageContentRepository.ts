/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
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
