/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { PageContentRepository } from '../repositories/PageContentRepository';
import { PageContent } from '../models/PageContent';
import { SearchUtil } from '../../utils/SearchUtil';
import { PageContentHasTagService } from './PageContentHasTagService';
import { PageContentImage } from '../models/PageContentImage';
import { PageContentImageService } from './PageContentImageService';
// import { PageContentHasTag } from '../models/PageContentHasTag';

@Service()
export class PageContentService {

    constructor(@OrmRepository() private pageRepository: PageContentRepository,
        @Logger(__filename) private log: LoggerInterface, private pageHasTagService: PageContentHasTagService,
        private pageContentImageService: PageContentImageService) {
    }
    public async save(page: any): Promise<PageContent> {
        this.log.info('Create a new pageHashTag => ', page.toString());
        return this.pageRepository.save(page);
    }
    // create page
    public async create(user: any, page: PageContent, pageHashTag: string[] = [], image: PageContentImage): Promise<PageContent> {
        this.log.info('Create a new page content => ', page.toString());
        const newPage = await this.pageRepository.save(page);
        const condition: any[] = [];

        let list: any = {};
        
        if (pageHashTag) {
            if (pageHashTag.length === 0) {
                list = {};
                list.pageId = newPage.id;
                list.tagId = null;
                condition.push(list); 
            } else {
                Array.from(pageHashTag).forEach((data: any) => {
                    list = {};
                    list.pageId = newPage.id;
                    list.tagId = Number(data);
                    condition.push(list);
                }); 
            }
            await this.pageHasTagService.create(condition);
            const newPageContentImages: any = new PageContentImage();
            newPageContentImages.pageId = newPage.id;
            newPageContentImages.imageUrl = image.imageUrl;
            newPageContentImages.createdByUsername = user.username;
            newPageContentImages.createdBy = user.id;
            await this.pageContentImageService.create(newPageContentImages); 
        }
        newPage.tagId = condition;
        return newPage;
    }

    // find one page
    public findOne(page: any): Promise<any> {
        const condition = {
            where: [{
                id: page.where.id
            }],
            relations: ['pageImages', 'user']
        };
        return this.pageRepository.findOne(condition);
    }
    public findpageId(page: any): Promise<any> {
        return this.pageRepository.query('SELECT content.* , pageimage.image_url FROM page_content as content inner join page_content_image as pageimage ON content.id = pageimage.page_content_id where page_content_id = ' + page.where.id + '');
        // 'SELECT content.* , pageimage.image_url FROM page_content as content inner join page_content_image'+
        // 'as pageimage ON content.id = pageimage.page_content_id where page_content_id = '+page+''
    }
    // find all page
    public findAll(): Promise<any> {
        this.log.info('Find all page');
        return this.pageRepository.find();
    }

    // find all page
    public findAlls(page: any): Promise<any> {
        this.log.info('Find all pageId');
        return this.pageRepository.find(page);
    }

    // update page
    public async update(user: any, page: PageContent, pTagContent: string[] = [], image: any): Promise<any> {
        this.log.info('Update a page => ', page.toString());
        const editPage = await this.pageRepository.save(page);
        const pHasTagContent: any[] = [];

        let list: any = {};
        if (pTagContent) {
            await this.pageHasTagService.delete({ pageId: editPage.id});
            if(pTagContent.length === 0){
                list = {};
                list.pageId = editPage.id;
                list.tagId = null;
                pHasTagContent.push(list);
            }else{
                Array.from(pTagContent).forEach((data: any) => {
                    list = {};
                    list.pageId = editPage.id;
                    list.tagId = Number(data);
                    pHasTagContent.push(list);
                });
            }
            await this.pageHasTagService.create(pHasTagContent);
            // pHasTagContent.forEach(async data => {
            //     const newPageContent = new PageContentHasTag();
            //     newPageContent.pageId = data.pageId;
            //     newPageContent.tagId = data.tagId;
            //     await this.pageHasTagService.update(newPageContent);
            // });
            const pageImageID = this.pageContentImageService.loopDataImage(page);

            const newPageContentImages: any = new PageContentImage();
            newPageContentImages.id = pageImageID;
            // newPageContentImages.pageId = page.id;
            newPageContentImages.imageUrl = image.imageUrl;
            newPageContentImages.modifiedByUsername = user.username;
            newPageContentImages.modifiedBy = user.id;

            await this.pageContentImageService.update(newPageContentImages);
        }
        editPage.tagId = pHasTagContent;
        return editPage;
    }

    // page List
    public search(limit: any, offset: any, select: any = [], relation: any = [], whereConditions: any = [], orderBy: any, count: boolean): Promise<any> {
        const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);

        if (count) {
            return this.pageRepository.count(condition);
        } else {
            return this.pageRepository.find(condition);
        }
    }

    public searchMoreRelation(limit: any, offset: any, select: any = [], relation: any = [], whereConditions: any = [], orderBy: any, count: boolean, showImage: boolean): Promise<any> {
        // const condition: any = [];
        if (showImage === true) {
            const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);
            if (count) {
                return this.pageRepository.count(condition);
            } else {
                return new Promise(async (resolve, reject) => {
                    this.pageRepository.find(condition).then(async (resultPageImage: any[]) => {
                        // const idList: any[] = [];
                        const resultSet: any[] = [];
                        // const jsonObject: any[] = [];
                        for (const pageid of resultPageImage) {
                            // idList.push(pageid.id);
                            const resultPage = await this.pageRepository.pageContentImagesList(pageid.id);
                            const newObj: any = {};
                            for (const result of resultPage) {
                                const data = Object.keys(result);

                                for (const key of data) {
                                    // let newKey: any[] = [];
                                    let newKey = key;
                                    let isImage = false;
                                    if (newKey.startsWith('pageContent_')) {
                                        newKey = newKey.replace('pageContent_', '');
                                    } else if (newKey.startsWith('pageImages_')) {
                                        newKey = newKey.replace('pageImages_', '');
                                        isImage = true;
                                    }

                                    if (isImage) {
                                        if (newObj.pageImages === undefined) {
                                            newObj.pageImages = {};
                                        }
                                        newObj.pageImages[newKey] = result[key];
                                    } else {
                                        newObj[newKey] = result[key];
                                    }

                                }
                                resultSet.push(newObj);
                            }
                        }

                        resolve(resultSet);
                    }).catch((error) => {
                        reject(error);
                    });
                });
            }
        } else {
            return this.search(limit, offset, select, relation, whereConditions, orderBy, count);
        }
        // console.log('>>>length ' + JSON.stringify(resultSet));
    }

    // delete page
    public async delete(id: number): Promise<any> {
        return await this.pageRepository.delete(id);
    }
    public getCheckIsDraft(value: any): any {
        if (value === null || value === undefined || value === '') {
            return undefined;
        } else {
            return value;
        }
    }
    public getCheckTagId(id: any): any {
        if (id.length < 0) {
            return [];
        } else {
            return id;
        }
    }
}
