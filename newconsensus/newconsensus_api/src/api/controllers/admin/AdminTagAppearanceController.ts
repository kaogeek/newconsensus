/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { JsonController, Post, Authorized, Body, Res, Req, Param, Get } from 'routing-controllers';
import { ResponceUtil } from '../../../utils/ResponceUtil';
import { SearchFilter } from '../requests/SearchFilterRequest';
import { CreateTagAppearanceRequest } from '../requests/CreateTagAppearanceRequest';
import { TagAppearance } from '../../models/TagAppearance';
import { TagAppearanceService } from '../../services/TagAppearanceService';

@JsonController('/admin/tagappearance')
export class AdminTagAppearanceController {
    constructor(private tagAppearanceService: TagAppearanceService) { }
    
    /**
     * @api {post} /api/admin/tagappearance/ Create TagAppearance API
     * @apiGroup AdminTagAppearance
     * @apiParam (Request body) {String} tag tag *
     * @apiParam (Request body) {number} contentId contentId *
     * @apiParam (Request body) {String} type type *
     * @apiParam (Request body) {number} countAppearance countAppearance
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "tag" : "",
     *      "contentId" : "",
     *      "type" : "",
     *      "countAppearance" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "New tagAppearance is created successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/tagappearance/
     * @apiErrorExample {json} tagAppearance error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/')
    @Authorized()
    public async createTagAppearance(@Body({ validate: true }) tagAppearance: CreateTagAppearanceRequest, @Res() response: any, @Req() request: any): Promise<any> {

        const currentTagAppearance = await this.tagAppearanceService.findOne({
            where: {
                tag: tagAppearance.tag,
                contentId: tagAppearance.contentId,
                type: tagAppearance.type
            },
        });

        if (currentTagAppearance) {
            const errorResponse = ResponceUtil.getErrorResponce('Duplicate TagAppearance name', currentTagAppearance);
            return response.status(400).send(errorResponse);
        }

        const tagAppearanceValue: any = new TagAppearance();
        tagAppearanceValue.name = tagAppearance.tag;
        tagAppearanceValue.contentId = tagAppearance.contentId;
        tagAppearanceValue.type = tagAppearance.type;
        tagAppearanceValue.countAppearance = tagAppearance.countAppearance;
        tagAppearanceValue.createdByUsername = request.user.username;
        tagAppearanceValue.createdBy = request.user.id;

        const data = await this.tagAppearanceService.create(tagAppearanceValue);

        if (!data) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable create tagAppearance', undefined);
            return response.status(400).send(errorResponse);
        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully create tagAppearance', data);
            return response.status(200).send(successResponse);
        }
    }

    /**
     * @api {get} /api/admin/tagappearance/:name Get tagappearance API
     * @apiGroup Adminpartner
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "name" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully fine tagAppearance.",
     * "status": "1"
     * }
     * @apiSampleRequest /api/admin/tagappearance/:name
     * @apiErrorExample {json} TagAppearance Fine error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:name')
    @Authorized()
    public async getTagAppearance(@Param('name') name: string, @Res() response: any, @Req() request: any): Promise<any> {
        const tagAppearance = await this.tagAppearanceService.findOne({
            where: {
                name
            },
        });

        if (!tagAppearance) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid tagAppearance name "' + name + '"', name);
            return response.status(400).send(errorResponse);
        }

        const successResponse = ResponceUtil.getSucessResponce('Successfully finding tagAppearance', tagAppearance);
        return response.status(200).send(successResponse);
    }

    /**
     * 
     * @api {post} /api/admin/tagappearance/search Search tagAppearance API
     * @apiGroup Adminpartner
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *    "message": "Successfully get tagAppearance search",
     *    "data":{
     *    "name" : "",
     *    "count": "",
     *    "type": "",
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/admin/tagappearance/search
     * @apiErrorExample {json} tagAppearance error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    @Authorized()
    public async tagAppearanceSearch(@Body({ validate: true }) filter: SearchFilter, @Res() response: any): Promise<any> {
        const tagAppearanceLists: any = await this.tagAppearanceService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);

        if (!tagAppearanceLists) {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search tagAppearance', []);
            return response.status(200).send(successResponse);
        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search tagAppearance', tagAppearanceLists);
            return response.status(200).send(successResponse);
        }

    }
}
