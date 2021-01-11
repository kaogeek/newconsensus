/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { JsonController, Get, Res, Post, Body, Authorized, QueryParam } from 'routing-controllers';
import { RelateTagService } from '../services/RelateTagService';
import { ResponceUtil } from '../../utils/ResponceUtil';
import { SearchFilter } from './requests/SearchFilterRequest';
import { ObjectUtil } from '../../utils/ObjectUtil';
import { TAG_CONTENT_TYPE } from '../../TagContentType';
import { TagAppearanceService } from '../services/TagAppearanceService';

@JsonController('/relatetag')
export class RelateTagController {
    constructor(private relateTagService: RelateTagService, private tagAppearanceService: TagAppearanceService) { }
    /**
     * @api {post} /api/relatetag/search Search RelateTag API
     * @apiGroup RelateTag
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
     *    "trendingScore": "",
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/relatetag/search
     * @apiErrorExample {json} relateTag error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    @Authorized('customer')
    public async relateTagSearch(@Body({ validate: true }) filter: SearchFilter, @Res() response: any): Promise<any> {
        const relateTagLists: any = await this.relateTagService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);

        if (!relateTagLists) {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search relateTag', []);
            return response.status(200).send(successResponse);
        } else {
            const showFields = ['name', 'trendingScore'];
            const result = [];
            for (const item of relateTagLists) {
                const parseRelateTag = ObjectUtil.createNewObjectWithField(item, showFields);
                result.push(parseRelateTag);
            }
            const successResponse = ResponceUtil.getSucessResponce('Successfully search relateTag', result);
            return response.status(200).send(successResponse);
        }
    }

    // RelateTag Proposal API
    /**
     * @api {get} /api/relatetag/proposal RelateTag Proposal
     * @apiGroup Proposal
     * @apiParamExample {json} Input
     * {
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "RelateTag Proposal Successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/relatetag/proposal
     * @apiErrorExample {json} Proposal error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/proposal')
    public async getRelateProposal(@QueryParam('content_id') contentId: number, @Res() response: any, @QueryParam('count') count?: number, @QueryParam('pagination') pagination?: number): Promise<any> {
        if(contentId === null || contentId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'contentId is null'));
        }
        
        try {
            const data: any = await this.tagAppearanceService.getRelateContent(contentId, TAG_CONTENT_TYPE.PROPOSAL , count, pagination);

            return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }

    // RelateTag Debate API
    /**
     * @api {get} /api/relatetag/debate RelateTag Debate
     * @apiGroup Debate
     * @apiParamExample {json} Input
     * {
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "RelateTag Debate Successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/relatetag/debate
     * @apiErrorExample {json} Debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/debate')
    public async getRelateDebate(@QueryParam('content_id') contentId: number, @Res() response: any, @QueryParam('count') count?: number, @QueryParam('pagination') pagination?: number): Promise<any> {
        if(contentId === null || contentId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'contentId is null'));
        }
        
        try {
            const data: any = await this.tagAppearanceService.getRelateContent(contentId, TAG_CONTENT_TYPE.PROPOSAL , count, pagination);

            return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }

    // RelateTag Vote API
    /**
     * @api {get} /api/relatetag/vote RelateTag Vote
     * @apiGroup Vote
     * @apiParamExample {json} Input
     * {
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "RelateTag Vote Successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/relatetag/vote
     * @apiErrorExample {json} Vote error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/vote')
    public async getRelateVote(@QueryParam('content_id') contentId: number, @Res() response: any, @QueryParam('count') count?: number, @QueryParam('pagination') pagination?: number): Promise<any> {
        if(contentId === null || contentId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'contentId is null'));
        }
        
        try {
            const data: any = await this.tagAppearanceService.getRelateContent(contentId, TAG_CONTENT_TYPE.PROPOSAL , count, pagination);

            return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }
}
