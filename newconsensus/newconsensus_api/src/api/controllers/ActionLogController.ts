import { JsonController, Req, Res, Post, Body } from 'routing-controllers';
import { ActionLogService } from '../services/ActionLogService';
import { ResponceUtil } from '../../utils/ResponceUtil';
import { SearchFilter } from './requests/SearchFilterRequest';
import { ObjectUtil } from '../../utils/ObjectUtil';
import { ActionLog } from '../models/ActionLog';
import { ACTION_LOG } from '../../ActionContentLog';
import { TAG_CONTENT_TYPE } from '../../TagContentType';
import { CreateActionLog } from './requests/CreateActionLogRequest';

@JsonController('/actionlog')
export class ActionLogController {
    constructor(private actionLogService: ActionLogService) { }
    
    /**
     * @api {post} /api/actionlog/search Search ActionLog API
     * @apiGroup ActionLog
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *    "message": "Successfully get actionLog search",
     *    "data":{
     *    "name" : "",
     *    "trendingScore": "",
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/actionlog/search
     * @apiErrorExample {json} actionLog error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    public async actionLogSearch(@Body({ validate: true }) filter: SearchFilter, @Res() response: any): Promise<any> {
        const actionLogLists: any = await this.actionLogService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);

        if (!actionLogLists) {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search actionLog', []);
            return response.status(200).send(successResponse);
        } else {
            const result = [];
            for (const item of actionLogLists) {
                const parseActionLog = ObjectUtil.createNewObjectWithField(item);
                result.push(parseActionLog);
            }
            const successResponse = ResponceUtil.getSucessResponce('Successfully search actionLog', result);
            return response.status(200).send(successResponse);
        }

    }

    // Create Action Log of ActionLog API
    /**
     * @api {post} /api/actionlog/addlog Create Log of ActionLog
     * @apiGroup ActionLog
     * @apiParam (Request body) {number} contentId Content ID *
     * @apiParam (Request body) {string} type Content Type *
     * @apiParam (Request body) {string} action Content Action *
     * @apiParamExample {json} Input
     * {
     *      "contentId" : "",
     *      "type" : "",
     *      "action" : ""
     * }
     * @apiParamExample {json} Input
     * {
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Create Log of ActionLog successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/actionlog/addlog
     * @apiErrorExample {json} Debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/addlog')
    public async create(@Body({ validate: true }) param: CreateActionLog, @Req() request: any,@Res() response: any): Promise<any> {
        try {

            let actionLog: string = ACTION_LOG.VIEW; // now fix =>> view

            if(param.action === ACTION_LOG.VIEW) {
                actionLog = ACTION_LOG.VIEW;
            }

            let contentType: string = param.contentType;
            const conId = param.contentId;

            if(param.contentType === TAG_CONTENT_TYPE.DEBATE) {
                contentType = param.contentType;
            } else if(param.contentType === TAG_CONTENT_TYPE.PROPOSAL) {
                contentType = param.contentType;
            } else if(param.contentType === TAG_CONTENT_TYPE.VOTE) {
                contentType = param.contentType;
            }

            if(contentType === null || contentType === undefined) {
                return response.status(400).send('contentType not found');
            }

            const log: any = await this.actionLogService.findOne({
                where: {
                    contentId: conId,
                    type: contentType,
                    action: actionLog,
                },
            });

            const newActionLog: any = new ActionLog();

            newActionLog.ip = (request.headers['x-forwarded-for'] ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            request.connection.socket.remoteAddress).split(',')[0];

            newActionLog.contentId = conId;

            const cId = request.headers['client-id'];

            newActionLog.clientId = cId;

            if(actionLog === null || actionLog === undefined) {
                actionLog = ACTION_LOG.VIEW;
            }

            newActionLog.action = actionLog;
            newActionLog.type = contentType;

            if(request.user !== null && request.user !== undefined) {
                newActionLog.userId = request.user.id;
            }
            
            if(log === null || log === undefined) {
                newActionLog.isFirst = true;
            } else {
                newActionLog.isFirst = false;
            }

            this.actionLogService.create(newActionLog);
            
            return response.status(200).send(ResponceUtil.getSucessResponce('Successfully Got Create Log of ActionLog', newActionLog));
        } catch (error) {
            return response.status(400).send(error);
        }
    }
}
