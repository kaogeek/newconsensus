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
import { ResponceUtil } from '../../utils/ResponceUtil';
import { MainPageVideoService } from '../services/MainPageVideoService';

@JsonController('/pagevideo')
export class MainPageVideoController {
    constructor(private mpVideoService: MainPageVideoService) {
    }

    // Main Page Video API
    // Find Page Video API
    /**
     * @api {get} /api/pagevideo/:id Find MainPagevideo
     * @apiGroup MainPagevideo
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Find MainPageVideo Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pagevideo/:id
     * @apiErrorExample {json} pagevideo error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    public async findPageVideo(@Param('id') pageVideoId: number, @Res() response: any): Promise<any> {
        const mpVideo = await this.mpVideoService.findOne({
            where: {
                id: pageVideoId,
            },
        });

        if (!mpVideo) {
            const errorResponse: any = ResponceUtil.getErrorResponce('Invalid MainPageVideo Id', undefined);
            return response.status(400).send(errorResponse);
        } else {
            const successResponse: any = ResponceUtil.getSucessResponce('Successfully Got MainPageVideo', mpVideo);
            return response.status(200).send(successResponse);
        }
    }

    // Search MainPagevideo API
    /**
     * @api {post} /api/pagevideo/search Search MainPagevideo
     * @apiGroup MainPagevideo
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
     *      "url" : "",
     *      "tagline" : "",
     *      "ordering" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Search MainPageVideo Successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pagevideo/search
     * @apiErrorExample {json} MainPageVideo error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    public async searchPageVideo(@Body() filter: SearchFilter, @Res() response: any): Promise<any> {
        const mpVideo: any = await this.mpVideoService.search(filter);

        if (mpVideo) {
            const sucessRes: any = ResponceUtil.getSucessResponce('Successfully Search MainPageVideo', mpVideo);
            return response.status(200).send(sucessRes);
        } else {
            const sucessRes: any = ResponceUtil.getSucessResponce('Successfully Search MainPageVideo', []);
            return response.status(200).send(sucessRes);
        }
    }
}
