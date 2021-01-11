/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { JsonController, Get, Param, Res, Post, Body } from 'routing-controllers';
import { PartnerService } from '../services/PartnerService';
import { ResponceUtil } from '../../utils/ResponceUtil';
import { SearchFilter } from './requests/SearchFilterRequest';

@JsonController('/partner')
export class PartnerController {
    constructor(private partnerService: PartnerService){}
    /**
     * @api {get} /api/partner/:id  Pageuser Find Partner API
     * @apiGroup Partner
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     *      {
     *      "message": "Successfully get Partner Details",
     *      "data":{
     *      "name" : "",
     *      "link" : "",
     *      "logo_url" : ""
     *      }
     *      "status": "1"
     *      }
     * @apiSampleRequest /api/partner/:id
     * @apiErrorExample {json} partner error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    public async partnerDetails(@Param('id') Id: number, @Res() response: any): Promise<any> {
        const partner = await this.partnerService.findOne({
            where: {
                id: Id,
            },
        });
        if (!partner) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable got partner', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got partner', partner);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {post} /api/partner/search Search Partner API
     * @apiGroup Partner
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *    "message": "Successfully get partner search",
     *    "data":{
     *    "name" : "",
     *    "description": "",
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/partner/search
     * @apiErrorExample {json} partner error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    public async partnerSearch(@Body({validate:true}) filter: SearchFilter, @Res() response: any): Promise<any> {
        const partnerLists: any = await this.partnerService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);

        if (!partnerLists) {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search partner', []);
            return response.status(200).send(successResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search partner', partnerLists);
            return response.status(200).send(successResponse);
        }
        
    }
}
