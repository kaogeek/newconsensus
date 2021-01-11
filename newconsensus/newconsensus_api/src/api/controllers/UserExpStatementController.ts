/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { Body, JsonController, Res, Get, Post, Param, Req } from 'routing-controllers';
import { SearchFilter } from './requests/SearchFilterRequest';
import { ResponceUtil } from '../../utils/ResponceUtil';
import { UserExpStatementService } from '../services/UserExpStatementService';
import { PageUser } from '../models/PageUser';
import { PageUserService } from '../services/PageUserService';

@JsonController('/exp')
export class DebateCommentController {
    constructor(private userExpStmtService: UserExpStatementService, private pageUserService: PageUserService) {
    }
    // Search API
    /**
     * @api {post} /api/exp/search Search API
     * @apiGroup Exp
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} isCount isCount (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Search user exp stmt Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/exp/search
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Post('/search')
    public async search(@Body() filter: SearchFilter, @Res() response: any): Promise<any> {

        if (filter === null || filter === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        try {
            const data: any[] = await this.userExpStmtService.search(filter);

            if (data !== null && data !== undefined) {
                return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
            }
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }
    // Find Zipcode API
    /**
     * @api {get} /api/exp/:user_id postcode Find API
     * @apiGroup Postcode
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully get user exp stmt Find",
     * "data":{
     * }
     * "status": "1"
     * }
     * @apiSampleRequest /api/exp/:id
     * @apiErrorExample {json} exp error
     * HTTP/1.1 500 Internal Server Error
     */

    // PageUser postcode Function
    @Get('/:user_id')
    public async findUserExp(@Param('user_id') userId: string, @Req() request: any, @Res() response: any): Promise<any> {

        if (userId !== null && userId !== undefined) {
            
            const userData = await this.userExpStmtService.userExp(userId);
            let score: any;
            for (const userLevel of userData) {
                score = userLevel.expcount;
            }
            if (!userData) {
                const errorResponse = ResponceUtil.getErrorResponce('User Exp State was invalid.', undefined);
                return response.status(400).send(errorResponse);
            } else {
                const pageUser = new PageUser();
                pageUser.currentExp = score;
                pageUser.id = Number(userId);
                const dataUser = this.pageUserService.updateExpUser(undefined, pageUser);
                if (dataUser) {
                    const successResponse = ResponceUtil.getSucessResponce('Successfully got user exp .', userData);
                    return response.status(200).send(successResponse);
                }
            }

        } else {

            const postcodeErrorResponse: any = {
                status: 0,
                message: 'id is null or undefined',
            };
            return response.status(400).send(postcodeErrorResponse);

        }
    }
}
