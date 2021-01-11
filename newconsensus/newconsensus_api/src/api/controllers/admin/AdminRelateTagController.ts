/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { JsonController, Post, Authorized, Body, Res, Req, Put, Param, Delete, Get, QueryParam } from 'routing-controllers';
import { ResponceUtil } from '../../../utils/ResponceUtil';
import { SearchFilter } from '../requests/SearchFilterRequest';
import { CreateRelateTagRequest } from '../requests/CreateRelateTagRequest';
import { RelateTag } from '../../models/RelateTag';
import { RelateTagService } from '../../services/RelateTagService';
import { UpdateRelateTagRequest } from '../requests/UpdateRelateTagRequest';
import { ConfigService } from '../../services/ConfigService';
import { DecayFunctionUtil } from '../../../utils/DecayFunctionUtil';
import { RELATETAG_TRENDING_SCORE_CONFIG_NAME, DEFAULT_RELATETAG_TRENDING_SCORE_CALCULATE_CONFIG } from '../../../Constants';

@JsonController('/admin/relatetag')
export class AdminRelateTagController {
    constructor(private relateTagService: RelateTagService, private configService:  ConfigService) { }
    
    /**
     * @api {post} /api/admin/relatetag/ Create RelateTag API
     * @apiGroup AdminRelateTag
     * @apiParam (Request body) {String} name name *
     * @apiParam (Request body) {number} trendingScore trendingScore
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "name" : "",
     *      "trendingScore" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "New relateTag is created successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/relatetag/
     * @apiErrorExample {json} relateTag error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/')
    @Authorized()
    public async createRelateTag(@Body({ validate: true }) relateTag: CreateRelateTagRequest, @Res() response: any, @Req() request: any): Promise<any> {

        const currentRelateTag = await this.relateTagService.findOne({
            where: {
                name: relateTag.name
            },
        });

        if (currentRelateTag) {
            const errorResponse = ResponceUtil.getErrorResponce('Duplicate RelateTag name', currentRelateTag);
            return response.status(400).send(errorResponse);
        }

        const relateTagValue: any = new RelateTag();
        relateTagValue.name = relateTag.name;
        relateTagValue.trendingScore = relateTag.trendingScore;
        relateTagValue.createdByUsername = request.user.username;
        relateTagValue.createdBy = request.user.id;

        const data = await this.relateTagService.create(relateTagValue);

        if (!data) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable create relateTag', undefined);
            return response.status(400).send(errorResponse);
        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully create relateTag', data);
            return response.status(200).send(successResponse);
        }
    }

    /**
     * @api {put} /api/admin/relatetag/:name Edit relateTag API
     * @apiGroup AdminRelateTag
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} name name *
     * @apiParam (Request body) {number} trendingScore trendingScore
     * @apiParamExample {json} Input
     * {
     *      "name" : "",
     *      "trendingScore" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully edit relateTag.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/relatetag/:name
     * @apiErrorExample {json} relateTag error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:name')
    @Authorized()
    public async editRelateTag(@Body({ validate: true }) relateTagReq: UpdateRelateTagRequest, @Param('name') name: string, @Res() response: any, @Req() request: any): Promise<any> {
        const oldRelateTag = await this.relateTagService.findOne({
            where: {
                name
            },
        });
        if (!oldRelateTag) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid relateTag name "' + name + '"', name);
            return response.status(400).send(errorResponse);
        }

        if(relateTagReq.trendingScore !== null && relateTagReq.trendingScore !== undefined){
            oldRelateTag.trendingScore = relateTagReq.trendingScore;
        }
        
        oldRelateTag.modifiedByUsername = request.user.username;
        oldRelateTag.modifiedBy = request.user.id;

        const relateTagSave = await this.relateTagService.edit(oldRelateTag, relateTagReq.name);

        if (!relateTagSave) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable edit relateTag', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully edit relateTag', relateTagSave);
            return response.status(200).send(successResponse);
        }
    }

    /**
     * @api {delete} /api/admin/relatetag/:name Delete relateTag API
     * @apiGroup AdminRelateTag
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "name" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully deleted relateTag.",
     * "status": "1"
     * }
     * @apiSampleRequest /api/admin/relatetag/:name
     * @apiErrorExample {json} RelateTag Delete error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/:name')
    @Authorized()
    public async deleteRelateTag(@Param('name') name: string, @Res() response: any, @Req() request: any): Promise<any> {
        const relateTag = await this.relateTagService.findOne({
            where: {
                name
            },
        });

        if (relateTag === null || relateTag === undefined) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid relateTag name "' + name + '"', name);
            return response.status(400).send(errorResponse);
        }

        const deleteRelateTag = await this.relateTagService.delete(relateTag);

        if (deleteRelateTag) {
            const successResponse = ResponceUtil.getSucessResponce('Successfully delete relateTag', name);
            return response.status(200).send(successResponse);

        } else {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to delete relateTag', undefined);
            return response.status(400).send(errorResponse);
        }
    }

    /**
     * 
     * @api {post} /api/admin/relatetag/search Search relateTag API
     * @apiGroup AdminRelateTag
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
     *    "message": "Successfully get relateTag search",
     *    "data":{
     *    "name" : "",
     *    "count": "",
     *    "type": "",
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/admin/relatetag/search
     * @apiErrorExample {json} relateTag error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    @Authorized()
    public async relateTagSearch(@Body({ validate: true }) filter: SearchFilter, @Res() response: any): Promise<any> {
        const relateTagLists: any = await this.relateTagService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);

        if (!relateTagLists) {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search relateTag', []);
            return response.status(200).send(successResponse);
        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search relateTag', relateTagLists);
            return response.status(200).send(successResponse);
        }

    }

    /**
     * @api {get} /api/admin/relatetag/topscore Get Top Score relateTag API
     * @apiGroup AdminRelateTag
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully Top Score relateTag.",
     * "status": "1"
     * }
     * @apiSampleRequest /api/admin/relatetag/topscore
     * @apiErrorExample {json} RelateTag Top Score error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/topscore')
    public async getTopScore(@Res() response: any, @Req() request: any, @QueryParam('limit') limit: number): Promise<any> {
        const orderBy: any = {
            trendingScore: 'DESC',
        };
        
        const relateTags: any[] = await this.relateTagService.search(limit, undefined, undefined, undefined, undefined, orderBy, false);

        if (!relateTags) {
            const errorResponse = ResponceUtil.getErrorResponce('Do not find topScore of Relateag', {});
            return response.status(400).send(errorResponse);
        }

        const successResponse = ResponceUtil.getSucessResponce('Successfully finding relateTag', relateTags);
        return response.status(200).send(successResponse);
    }

    // Calculate Trending Score of RelateTag API
    /**
     * @api {post} /api/admin/relatetag/trendingscore Calculate Trending Score of RelateTag
     * @apiGroup RelateTag
     * @apiParamExample {json} Input
     * {
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Calculate Trending Score of RelateTag successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/relatetag/trendingscore
     * @apiErrorExample {json} RelateTag error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/trendingscore')
    public async updateTrendingScore(@Res() response: any): Promise<any> {
        try {
            const rangeConfig = await this.configService.getConfig(RELATETAG_TRENDING_SCORE_CONFIG_NAME.DAY_RANGE);
            let relateRange = DEFAULT_RELATETAG_TRENDING_SCORE_CALCULATE_CONFIG.DAY_RANGE;

            if (rangeConfig && rangeConfig.value) {
                relateRange = parseFloat(rangeConfig.value);
            }

            const range = DecayFunctionUtil.getBeforeTodayRange(relateRange);
            
            const startDate = range[0];
            const endDate = range[1];

            const relateTag: any = await this.relateTagService.updateTrendingScore(startDate, endDate);

            return response.status(200).send(ResponceUtil.getSucessResponce('Successfully Got TrendingScore RelateTAg', relateTag));
        } catch (error) {
            return response.status(400).send(error);
        }
    }
}
