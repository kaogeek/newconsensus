/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { Get, Param, Res, JsonController, Post, Body } from 'routing-controllers';
import { ActivityNewsService } from '../services/ActivityNewsService';
import { ResponceUtil } from '../../utils/ResponceUtil';
import { SearchFilter } from './requests/SearchFilterRequest';

@JsonController('/activity')
export class ActivityNewsController {
    constructor(private activityService: ActivityNewsService) {

    }
    /**
     * @api {get} /api/activity/:id  Pageuser Find activity API
     * @apiGroup Activity
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     *      {
     *      "message": "Successfully get activity Details",
     *      "data":{
     *      }
     *      "status": "1"
     *      }
     * @apiSampleRequest /api/activity/:id
     * @apiErrorExample {json} activity error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    public async activityDetails(@Param('id') activityId: number, @Res() response: any): Promise<any> {

        const data = await this.activityService.findOne({
            where: {
                id: activityId,
            },
        });
        if (!data) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable got activity', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got activity', data);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {post} /api/activity/search Pageuser Search activity API
     * @apiGroup Activity
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *    "message": "Successfully get activity search",
     *    "data":{
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/activity/search
     * @apiErrorExample {json} activity error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    public async activitySearch(@Body() filter: SearchFilter, @Res() response: any): Promise<any> {
  
        const activityLists: any = await this.activityService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);

        if (!activityLists) {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got search activity', []);
            return response.status(200).send(successResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got search activity', activityLists);
            return response.status(200).send(successResponse);

        }
    }
   
}
