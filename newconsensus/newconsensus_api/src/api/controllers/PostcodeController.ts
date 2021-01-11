/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { Get, JsonController, Res, Req, Param, Post, Body, } from 'routing-controllers';
import { AddressPostcodeService } from '../services/AddressPostcodeService';
import { SearchFilter } from './requests/SearchFilterRequest';
import { ResponceUtil } from '../../utils/ResponceUtil';

@JsonController('/postcode')
export class PostcodeController {
    constructor(
        private postcodeService: AddressPostcodeService) {
    }

    // Find Zipcode API
    /**
     * @api {get} /api/postcode/:id postcode Find API
     * @apiGroup Postcode
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully get postcode Find",
     * "data":{
     *          "id" : "",
     *          "province" : "",
     *          "postcode" : "",
     * }
     * "status": "1"
     * }
     * @apiSampleRequest /api/postcode/:id
     * @apiErrorExample {json} postcode error
     * HTTP/1.1 500 Internal Server Error
     */

    // PageUser postcode Function
    @Get('/:id')
    public async findPostcode(@Param('id') postcodeId: number, @Req() request: any, @Res() response: any): Promise<any> {
        // check postcode
        if (postcodeId !== null && postcodeId !== undefined) {
            const postcode = await this.postcodeService.findZipcode(postcodeId + '');
            if (!postcode) {

                const errorResponse = ResponceUtil.getErrorResponce('Postcode was invalid.', undefined);
                return response.status(400).send(errorResponse);
            } else {
                const successResponse = ResponceUtil.getSucessResponce('Successfully got postcode.', postcode);
                return response.status(200).send(successResponse);
            }

        } else {

            const postcodeErrorResponse: any = {
                status: 0,
                message: 'id is null or undefined',
            };
            return response.status(400).send(postcodeErrorResponse);

        }
    }

    // PageUser postcode Search Function
    /**
     * @api {post} /api/postcode/search Search API
     * @apiGroup Postcode
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} isCount isCount (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Search Postcode Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/postcode/search
     * @apiErrorExample {json} postcode error
     * HTTP/1.1 500 Internal Server Error
     */

    @Post('/search')
    public async search(@Body() filter: SearchFilter, @Req() request: any, @Res() response: any): Promise<any> {
        if (filter === null || filter === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'Filer is null'));
        }

        try {
            const zipcodeList: any[] = await this.postcodeService.search(filter);

            if (zipcodeList !== null && zipcodeList !== undefined) {
                return response.status(200).send(ResponceUtil.getSucessResponce('success', zipcodeList));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', 'can not search'));
            }
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }

}
