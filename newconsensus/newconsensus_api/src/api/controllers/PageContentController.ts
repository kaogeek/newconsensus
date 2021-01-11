/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { Get, JsonController, Res, Param, Post, Body, QueryParam } from 'routing-controllers';
// import {PageContent} from '../models/PageContent';
// import {CreatePage} from './requests/CreatePageRequest';
import { PageContentService } from '../services/PageContentService';
import { SearchFilter } from './requests/SearchFilterRequest';
import { ResponceUtil } from '../../utils/ResponceUtil';
import { PageContentHasTagService } from '../services/PageContentHasTagService';
import { ObjectUtil } from '../../utils/ObjectUtil';
import { UserService } from '../services/UserService';
// import { Equal, Not } from 'typeorm';
// import { Not, Equal } from 'typeorm';
// import { PageContent } from '../models/PageContent';
// import {UpdatePageContent} from './requests/UpdatePageContentRequest';
// import {DeletePageRequest} from './requests/DeletePageRequest';

@JsonController('/content')
export class PageContentController {
    constructor(private pageService: PageContentService, private pageHasTag: PageContentHasTagService,
        private userService: UserService) {
    }
    /**
     * @api {get} /api/content/:id Pageuser Find page_content API
     * @apiGroup PageContent
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully get pageContent Details",
     * "data":{
     * "name" : "",
     * "description" : "",
     * }
     * "status": "1"
     * }
     * @apiSampleRequest /api/content/:id
     * @apiErrorExample {json} content error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    public async pageContentDetails(@Param('id') Id: number, @Res() response: any): Promise<any> {
        const page = await this.pageService.findOne({
            where: {
                id: Id,
            },
        });

        if (page !== undefined) {
            const user = await this.userService.findOne({
                where: {
                    id: page.createdBy
                }
            });
            if (user !== undefined) {
                const showFields = ['firstName', 'lastName'];
                page.user = ObjectUtil.createNewObjectWithField(user, showFields);
            }
            if (!page) {
                const errorResponse = ResponceUtil.getErrorResponce('invalid content', page);
                return response.status(400).send(errorResponse);

            }
            if (!page) {
                const errorResponse = ResponceUtil.getErrorResponce('Unable to find content', undefined);
                return response.status(400).send(errorResponse);

            } else {
                const successResponse = ResponceUtil.getSucessResponce('Successfully find content', page);
                return response.status(200).send(successResponse);
            }
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('Unable to get Page Content ', undefined);
            return response.status(400).send(errorResponse);
        }

    }
    /**
     * @api {post} /api/content/search Pageuser Search page_content API
     * @apiGroup PageContent
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *    "message": "Successfully get pageContent search",
     *    "data":{
     *    "name" : "",
     *    "description": "",
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/content/search
     * @apiErrorExample {json} tag error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    public async contentSearch(@Body({ validate: true }) filter: SearchFilter, @QueryParam('show_image') showImage: boolean, @Res() response: any): Promise<any> {
        const contentLists: any = await this.pageService.searchMoreRelation(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count, showImage);

        if (!contentLists) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to create content', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully create content', contentLists);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {post} /api/content/:id/count Pageuser view page_content API
     * @apiGroup PageContent
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *    "message": "Successfully view count,
     *    "data":{
     *    "name" : "",
     *    "description": "",
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/content/:id/count
     * @apiErrorExample {json} tag error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/:id/count')
    public async contentView(@Param('id') contentId: number, @Res() response: any): Promise<any> {

        const getView = await this.pageService.findOne({
            where: {
                id: contentId,
            },
        });
        getView.view_count = getView.view_count;
        getView.view_count += 1;

        const countView = await this.pageService.save(getView);
        
        if (!countView) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid content', countView);
            return response.status(400).send(errorResponse);

        }
        if (!countView) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to count view countent', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully count view countent', countView);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {get} /api/content/hastag/:id Pageuser Search page_content has tag API
     * @apiGroup PageContent
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get pageContent has id Details",
     *      "data":{
     *      "name" : "",
     *      "description" : "",
     *      }
     * "status": "1"
     * }
     * @apiSampleRequest /api/content/hastag/:id 
     * @apiErrorExample {json} content error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/hastag/:id')
    public async pageContentHasDetails(@Param('id') Id: number, @Res() response: any): Promise<any> {
        const page = await this.pageHasTag.findAlls({
            where: {
                tagId: Id,
            },
        });

        if (!page) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid content has tag', page);
            return response.status(400).send(errorResponse);
        } 
        if (!page) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to find content has tag', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully find content has tag', page);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {post} /api/content/hastag/search Pageuser hastagSearch Room API
     * @apiGroup PageContent
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *    "message": "Successfully get content hasTag search",
     *    "data":{
     *    "name" : "",
     *    "description": "",
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/content/hastag/search
     * @apiErrorExample {json} room error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/hastag/search')
    public async pageTagSearch(@Body() filter: SearchFilter,@QueryParam('show_article') showArticle: boolean, @Res() response: any): Promise<any> {
        const pageTagLists: any = await this.pageHasTag.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count,showArticle);

        if (!pageTagLists) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable got hastag', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got hastag', pageTagLists);
            return response.status(200).send(successResponse);
        }
    }

}
