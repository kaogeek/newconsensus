import { JsonController, Post, Authorized, Body, Res, Req, Put, Param, Delete } from 'routing-controllers';
// import { CreateRoomRequest } from '../requests/CreateRoomRequest';
// import { Room } from '../../models/Room';
// import { ResponceUtil } from 'src/utils/ResponceUtil';
import { CreatePartnerRequest } from '../requests/CreatePartnerRequest';
import { Partner } from '../../models/Partner';
import { PartnerService } from '../../services/PartnerService';
import { ResponceUtil } from '../../../utils/ResponceUtil';
import { UpdatePartnerRequest } from '../requests/UpdatePartnerRequest';
import { SearchFilter } from '../requests/SearchFilterRequest';

@JsonController('/admin/partner')
export class AdminPartnerController {
    constructor(private partnerService: PartnerService){}
    /**
     * @api {post} /api/admin/partner/ Create Partner API
     * @apiGroup AdminPartner
     * @apiParam (Request body) {String} name name
     * @apiParam (Request body) {String} link link
     * @apiParam (Request body) {String} logoUrl logoUrl
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "name" : "",
     *      "link" : "",
     *      "logoUrl" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "New partner is created successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/partner/
     * @apiErrorExample {json} partner error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/')
    @Authorized()
    public async createPartner(@Body({ validate: true }) partner: CreatePartnerRequest, @Res() response: any, @Req() request: any): Promise<any> {
        const partnerValue: any = new Partner();
        partnerValue.name = partner.name;
        partnerValue.link = partner.link;
        partnerValue.logoUrl = partner.logoUrl;
        partnerValue.createdByUsername = request.user.username;
        partnerValue.createdBy = request.user.id;

        const data = await this.partnerService.create(partnerValue);
    
        if (!data) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable create partner', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully create partner', data);
            return response.status(200).send(successResponse);
        }

    }
    /**
     * @api {put} /api/admin/partner/:id Edit partner API
     * @apiGroup AdminPartner
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} name AdminPartner name
     * @apiParam (Request body) {String} link link
     * @apiParam (Request body) {String} logoUrl logoUrl
     * @apiParamExample {json} Input
     * {
     *      "name" : "",
     *      "link" : "",
     *      "logoUrl" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully edit partner.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/partner/:id
     * @apiErrorExample {json} partner error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:id')
    @Authorized()
    public async editPartner(@Body({ validate: true }) partnerStatus: UpdatePartnerRequest, @Param('id') Id: number, @Res() response: any, @Req() request: any): Promise<any> {
        const editPartner = await this.partnerService.findOne({
            where: {
                id: Id,
            },
        });
        if (!editPartner) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid roomid', editPartner);
            return response.status(400).send(errorResponse);

        }
        editPartner.name = partnerStatus.name;
        editPartner.link = partnerStatus.link;
        editPartner.logoUrl = partnerStatus.logoUrl;
        editPartner.modifiedByUsername = request.user.username;
        editPartner.modifiedBy = request.user.id;

        const partnerSave = await this.partnerService.create(editPartner);
        if (!partnerSave) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable edit partner', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully edit partner', partnerSave);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {delete} /api/admin/partner/:id Delete partner API
     * @apiGroup AdminPartner
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully deleted partner.",
     * "status": "1"
     * }
     * @apiSampleRequest /api/admin/partner/:id
     * @apiErrorExample {json} partner Delete error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/:id')
    @Authorized()
    public async deletePartner(@Param('id') Id: number, @Res() response: any, @Req() request: any): Promise<any> {
        const partner = await this.partnerService.findOne({
            where: {
                id: Id,
            },
        });
        if (!partner) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid partner id', partner);
            return response.status(400).send(errorResponse);
        }
        const deletePartner = await this.partnerService.delete(Id);

        if (deletePartner) {
            const successResponse = ResponceUtil.getSucessResponce('Successfully delete partner', Id);
            return response.status(200).send(successResponse);

        } else {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to delete partner', undefined);
            return response.status(400).send(errorResponse);
        }
    }
    /**
     * @api {post} /api/admin/partner/search Search partner API
     * @apiGroup AdminPartner
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
     *    "message": "Successfully get partner search",
     *    "data":{
     *    "name" : "",
     *    "link": "",
     *    "logo_url": "",
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/admin/partner/search
     * @apiErrorExample {json} room error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    @Authorized()
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
