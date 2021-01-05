import { JsonController, Post, Authorized, Body, Res, Req, Put, Param, Delete, Get } from 'routing-controllers';
import { ResponceUtil } from '../../../utils/ResponceUtil';
import { SearchFilter } from '../requests/SearchFilterRequest';
import { CreateConfigRequest } from '../requests/CreateConfigRequest';
import { Config } from '../../models/Config';
import { ConfigService } from '../../services/ConfigService';
import { UpdateConfigRequest } from '../requests/UpdateConfigRequest';

@JsonController('/admin/config')
export class AdminConfigController {
    constructor(private configService: ConfigService) { }

    /**
     * @api {post} /api/admin/config/ Create Config API
     * @apiGroup AdminConfig
     * @apiParam (Request body) {String} name name *
     * @apiParam (Request body) {String} value value
     * @apiParam (Request body) {String} type type as a value class type such as boolean, string, integer *
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "name" : "",
     *      "value" : "",
     *      "type" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "New config is created successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/config/
     * @apiErrorExample {json} config error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/')
    @Authorized()
    public async createConfig(@Body({ validate: true }) config: CreateConfigRequest, @Res() response: any, @Req() request: any): Promise<any> {

        const currentConfig = await this.configService.findOne({
            where: {
                name: config.name
            },
        });

        if (currentConfig) {
            const errorResponse = ResponceUtil.getErrorResponce('Duplicate Config name', currentConfig);
            return response.status(400).send(errorResponse);
        }

        const configValue: any = new Config();
        configValue.name = config.name;
        configValue.value = config.value;
        configValue.type = config.type;
        configValue.createdByUsername = request.user.username;
        configValue.createdBy = request.user.id;

        const data = await this.configService.create(configValue);

        if (!data) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable create config', undefined);
            return response.status(400).send(errorResponse);
        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully create config', data);
            return response.status(200).send(successResponse);
        }
    }

    /**
     * @api {put} /api/admin/config/:name Edit config API
     * @apiGroup Adminpartner
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} name name *
     * @apiParam (Request body) {String} value value
     * @apiParam (Request body) {String} type type as a value class type such as boolean, string, integer *
     * @apiParamExample {json} Input
     * {
     *      "value" : "",
     *      "type" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully edit config.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/config/:name
     * @apiErrorExample {json} config error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:name')
    @Authorized()
    public async editConfig(@Body({ validate: true }) configReq: UpdateConfigRequest, @Param('name') name: string, @Res() response: any, @Req() request: any): Promise<any> {
        const editConfig = await this.configService.findOne({
            where: {
                name
            },
        });
        if (!editConfig) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid config name "' + name + '"', name);
            return response.status(400).send(errorResponse);
        }

        editConfig.value = configReq.value;
        editConfig.type = configReq.type;
        editConfig.modifiedByUsername = request.user.username;
        editConfig.modifiedBy = request.user.id;

        const configSave = await this.configService.edit(editConfig);
        if (!configSave) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable edit config', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully edit config', configSave);
            return response.status(200).send(successResponse);
        }
    }

    /**
     * @api {delete} /api/admin/config/:name Delete config API
     * @apiGroup Adminpartner
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "name" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully deleted config.",
     * "status": "1"
     * }
     * @apiSampleRequest /api/admin/config/:name
     * @apiErrorExample {json} Config Delete error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/:name')
    @Authorized()
    public async deleteConfig(@Param('name') name: string, @Res() response: any, @Req() request: any): Promise<any> {
        const config = await this.configService.findOne({
            where: {
                name
            },
        });

        if (!config) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid config name "' + name + '"', name);
            return response.status(400).send(errorResponse);
        }

        const deleteConfig = await this.configService.delete(config);

        if (deleteConfig) {
            const successResponse = ResponceUtil.getSucessResponce('Successfully delete config', name);
            return response.status(200).send(successResponse);

        } else {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to delete config', undefined);
            return response.status(400).send(errorResponse);
        }
    }

    /**
     * @api {get} /api/admin/config/:name Get config API
     * @apiGroup Adminpartner
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "name" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully deleted config.",
     * "status": "1"
     * }
     * @apiSampleRequest /api/admin/config/:name
     * @apiErrorExample {json} Config Delete error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:name')
    @Authorized()
    public async getConfig(@Param('name') name: string, @Res() response: any, @Req() request: any): Promise<any> {
        const config = await this.configService.findOne({
            where: {
                name
            },
        });

        if (!config) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid config name "' + name + '"', name);
            return response.status(400).send(errorResponse);
        }

        const successResponse = ResponceUtil.getSucessResponce('Successfully finding config', config);
        return response.status(200).send(successResponse);
    }

    /**
     * 
     * @api {post} /api/admin/config/search Search config API
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
     *    "message": "Successfully get config search",
     *    "data":{
     *    "name" : "",
     *    "value": "",
     *    "type": "",
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/admin/config/search
     * @apiErrorExample {json} config error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    @Authorized()
    public async configSearch(@Body({ validate: true }) filter: SearchFilter, @Res() response: any): Promise<any> {
        const configLists: any = await this.configService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);

        if (!configLists) {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search config', []);
            return response.status(200).send(successResponse);
        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search config', configLists);
            return response.status(200).send(successResponse);
        }

    }
}
