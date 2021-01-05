/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { Post, Get, Param, Body, JsonController, Res } from 'routing-controllers';
import { SearchFilter } from './requests/SearchFilterRequest';
import { MainPageSlideService } from '../services/MainPageSlideService';
import { ResponceUtil } from '../../utils/ResponceUtil';

@JsonController('/pageslide')
export class MainPageSlideController {
    constructor(private mpSlideService: MainPageSlideService) {
    }

    // Main Page Slide API
    // Find Page Slide API
    /**
     * @api {get} /api/pageslide/:id Find MainPageSlide
     * @apiGroup MainPageSlide
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Find MainPageSlide Successfully",
     *      "data":{
     *      "id" : "",
     *      "videoUrl" : "",
     *      "imageUrl" : "",
     *      "odering" : "",
     *      "delayMilisec" : "",
     *      "isAutoPlay" : "",
     *      "createdBy" : "",
     *      "createdByUsername" : "",
     *      "createdDate" : "",
     *      "modifiedBy" : "",
     *      "modifiedByUsername" : "",
     *      "modifiedDate" : "",
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageslide/:id
     * @apiErrorExample {json} pageslide error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    public async findPageSlide(@Param('id') pageSlideId: number, @Res() response: any): Promise<any> {
        const mpSlide = await this.mpSlideService.findOne({
            where: {
                id: pageSlideId,
            },
        });

        if (!mpSlide) {
            const errorResponse: any = ResponceUtil.getErrorResponce('Invalid MainPageSlide Id', undefined);
            return response.status(400).send(errorResponse);
        } else {
            const successResponse: any = ResponceUtil.getSucessResponce('Successfully Got MainPageSlide', mpSlide);
            return response.status(200).send(successResponse);
        }
    }

    // Search MainPageSlide API
    /**
     * @api {post} /api/pageslide/search Search MainPageSlide
     * @apiGroup MainPageSlide
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
     *      "videoUrl" : "",
     *      "imageUrl" : "",
     *      "ordering" : "",
     *      "delayMilisec" : "",
     *      "isAutoPlay" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Search MainPageSlide Successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageslide/search
     * @apiErrorExample {json} MainPageSlide error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    public async searchPageSlide(@Body() filter: SearchFilter, @Res() response: any): Promise<any> {
        const mpSlide: any = await this.mpSlideService.search(filter);

        if (mpSlide) {
            const sucessRes: any = ResponceUtil.getSucessResponce('Successfully Search MainPageSlide', mpSlide);
            return response.status(200).send(sucessRes);
        } else {
            const sucessRes: any = ResponceUtil.getSucessResponce('Successfully Search MainPageSlide', []);
            return response.status(200).send(sucessRes);
        }
    }
}
