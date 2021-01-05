import 'reflect-metadata';
import { Get, JsonController, Res, Param, Post, Body, QueryParam } from 'routing-controllers';
import { TagService } from '../services/TagService';
import { classToPlain } from 'class-transformer';
import { SearchFilter } from './requests/SearchFilterRequest';
import { PageContentHasTagService } from '../services/PageContentHasTagService';
import { PageContentService } from '../services/PageContentService';
import { ResponceUtil } from '../../utils/ResponceUtil';
@JsonController('/tag')
export class TagController {
    constructor(private tagService: TagService, private pageHashtag: PageContentHasTagService, private pageService: PageContentService) {

    }
    /**
     * @api {get} /api/tag/:id  Pageuser Find Tag API
     * @apiGroup Tag
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     *      {
     *      "message": "Successfully get Tag Details",
     *      "data":{
     *      "name" : "",
     *      "description" : "",
     *      }
     *      "status": "1"
     *      }
     * @apiSampleRequest /api/tag/:id
     * @apiErrorExample {json} tag error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    public async tagDetails(@Param('id') Id: number, @Res() response: any): Promise<any> {
        const page = await this.tagService.findOne({
            where: {
                id: Id,
            },
        });
        if (!page) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable got tag', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got tag', page);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {post} /api/tag/search Pageuser Search Tag API
     * @apiGroup Tag
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *    "message": "Successfully get tag search",
     *    "data":{
     *    "name" : "",
     *    "description": "",
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/tag/search
     * @apiErrorExample {json} tag error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    public async tagSearh(@Body({ validate: true }) filter: SearchFilter, @Res() response: any): Promise<any> {
        const tagLists: any = await this.tagService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);
        
        if (!tagLists) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable got search tag', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got search tag', tagLists);
            return response.status(200).send(successResponse);

        }
    }
    /**
     * @api {get} /api/tag/:id/content Pageuser List tagContent API
     * @apiGroup Tag
     * @apiParam (Request body) {Number} limit limit
     * @apiParam (Request body) {Number} offset offset
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "status": "1"
     *      "message": "Successfully get tagContent Detail",
     *      "data":"{}"
     * }
     * @apiSampleRequest /api/tag/:id/content
     * @apiErrorExample {json} tagContent error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id/content')
    public async tagContentDetails(@QueryParam('limit') limit: any, @QueryParam('offset') offsets: any, @Param('id') id: number, @Res() response: any): Promise<any> {
        const page = await this.pageHashtag.findAlls({
            select: ['pageId'],
            where: {
                tagId: id,
            },
        });
        const searchfilter: SearchFilter = new SearchFilter();
        const contentTag: any = classToPlain(page);
        const condition: any = {};
        condition.where = [];

        for (const data of contentTag) {
            condition.where.push({
                id: data.pageId,
            });
        }
        const searchContent: any[] = await this.pageService.search(limit, offsets, searchfilter.select, searchfilter.offset, condition.where, searchfilter.orderBy,searchfilter.count);

        if (searchContent!== null || searchContent !== undefined) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable got search tag', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got search tag', searchContent);
            return response.status(200).send(successResponse);
        }
    }
}
