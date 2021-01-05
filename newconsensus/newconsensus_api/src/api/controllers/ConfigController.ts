import { JsonController, Get, Param, Res, Post, Body } from 'routing-controllers';
import { ConfigService } from '../services/ConfigService';
import { ResponceUtil } from '../../utils/ResponceUtil';
import { SearchFilter } from './requests/SearchFilterRequest';
import { ObjectUtil } from '../../utils/ObjectUtil';

@JsonController('/config')
export class ConfigController {
    constructor(private configService: ConfigService) { }
    /**
     * @api {get} /api/config/:name  Pageuser Find Config API
     * @apiGroup Config
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     *      {
     *      "message": "Successfully get Config Details",
     *      "data":{
     *      "name" : "",
     *      "link" : "",
     *      "logo_url" : ""
     *      }
     *      "status": "1"
     *      }
     * @apiSampleRequest /api/config/:name
     * @apiErrorExample {json} config error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:name')
    public async configDetails(@Param('name') name: string, @Res() response: any): Promise<any> {
        const config = await this.configService.findOne({
            where: {
                name
            },
        });
        if (!config) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable got config', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const showFields = ['name', 'value', 'type'];
            const parseConfig = ObjectUtil.createNewObjectWithField(config, showFields);
            const successResponse = ResponceUtil.getSucessResponce('Successfully got config', parseConfig);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {post} /api/config/search Search Config API
     * @apiGroup Config
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *    "message": "Successfully get config search",
     *    "data":{
     *    "name" : "",
     *    "description": "",
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/config/search
     * @apiErrorExample {json} config error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    public async configSearch(@Body({ validate: true }) filter: SearchFilter, @Res() response: any): Promise<any> {
        const configLists: any = await this.configService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);

        if (!configLists) {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search config', []);
            return response.status(200).send(successResponse);
        } else {
            const showFields = ['name', 'value', 'type'];
            const result = [];
            for (const item of configLists) {
                const parseConfig = ObjectUtil.createNewObjectWithField(item, showFields);
                result.push(parseConfig);
            }
            const successResponse = ResponceUtil.getSucessResponce('Successfully search config', result);
            return response.status(200).send(successResponse);
        }

    }
}
