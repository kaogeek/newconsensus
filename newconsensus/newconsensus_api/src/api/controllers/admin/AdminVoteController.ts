import 'reflect-metadata';
import { Get, Post, Param, JsonController, Res, Body, Authorized, Put, Delete, Req } from 'routing-controllers';
import { VoteService } from '../../services/VoteService';
import { SearchFilter } from '../requests/SearchFilterRequest';
import { UpdateVote } from '../requests/UpdateVoteRequest';
import { ResponceUtil } from '../../../utils/ResponceUtil';
import { CreateVote } from '../requests/CreateVoteRequest';
import { Vote } from '../../../api/models/Vote';
import { BadWordService } from '../../services/BadWordService';

@JsonController('/admin/vote')
export class AdminVoteController {

    constructor(private voteService: VoteService, private badWordService: BadWordService) {
    }

    // Admin Vote API
    // Find API
    /**
     * @api {get} /api/admin/vote/:id Find API
     * @apiGroup Admin Vote
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Find Vote Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/vote/:id
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Get('/:id')
    @Authorized()
    public async findId(@Param('id') id: number, @Res() response: any): Promise<any> {
        if (id === null || id === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        try {
            const data: any = await this.voteService.findId(id);
            return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }

    // Admin Vote API
    // Search API
    /**
     * @api {post} /api/admin/vote/search Search API
     * @apiGroup Admin Vote
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} isCount isCount (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Search Vote Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/vote/search
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Post('/search')
    @Authorized()
    public async search(@Body() filter: SearchFilter, @Res() response: any): Promise<any> {

        if (filter === null || filter === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        try {
            const data: any[] = await this.voteService.search(filter);

            if (data !== null && data !== undefined) {
                return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
            }
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }

    // Admin Vote API
    // Create API
    /**
     * @api {post} /api/admin/vote Create API
     * @apiGroup Admin Vote
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} title Title
     * @apiParam (Request body) {String} tagline Tagline
     * @apiParam (Request body) {String} content Content
     * @apiParam (Request body) {Number} proposalId Proposal Id
     * @apiParam (Request body) {Number} roomId Room Id
     * @apiParam (Request body) {String} cover cover 
     * @apiParam (Request body) {String} link Link
     * @apiParam (Request body) {String} description description
     * @apiParam (Request body) {Date} endDate End Date
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Create Vote Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/vote
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Post('/')
    @Authorized()
    public async createVote(@Body({ validate: true }) param: CreateVote, @Req() request: any, @Res() response: any): Promise<any> {
        const vote = new Vote();

        vote.proposalId = param.proposalId;
        vote.roomId = param.roomId;
        vote.link = param.link;
        vote.title = this.badWordService.clean(param.title);
        vote.content = this.badWordService.clean(param.content);
        vote.tagline = param.tagline;
        vote.description = param.description;
        vote.coverImage = param.coverImage;
        vote.isActive = param.isActive;
        vote.videoUrl = param.videoUrl;
        vote.imageUrl = param.imageUrl;

        if (request.user === null || request.user === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        try {

            let relateTags: string[] = [];

            if(param.relateTag !== undefined && param.relateTag.length > 0) {
                relateTags = param.relateTag;
            }

            const data = await this.voteService.create(request.user, vote, relateTags);

            if (data !== null && data !== undefined) {
                return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
            }
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }

    // Admin Vote API
    // Update API
    /**
     * @api {put} /api/admin/vote/:id Update API
     * @apiGroup Admin Vote
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} title Title
     * @apiParam (Request body) {String} tagline Tagline
     * @apiParam (Request body) {String} content Content
     * @apiParam (Request body) {Boolean} isActive Is Active
     * @apiParam (Request body) {String} cover Cover
     * @apiParam (Request body) {String} link Link
     * @apiParam (Request body) {String} description description
     * @apiParam (Request body) {Date} endDate End Date
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Update Vote Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/vote/:id
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:id')
    @Authorized()
    public async updateVote(@Body({ validate: true }) param: UpdateVote, @Param('id') id: number, @Req() request: any, @Res() response: any): Promise<any> {
        if (id === null || id === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        if (request.user === null || request.user === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        const vote = await this.voteService.findOne(id);

        if (vote !== null && vote !== undefined) {

            // validate user
            if (vote.createdBy !== null && vote.createdBy !== undefined) {
                if (vote.createdBy !== request.user.id) {
                    return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
                }
            }

            vote.title = this.badWordService.clean(param.title);
            vote.content = this.badWordService.clean(param.content);
            vote.endDate = param.endDate;
            vote.link = param.link;
            vote.tagline = param.tagline;
            vote.coverImage = param.coverImage;
            vote.description = param.description;
            vote.isActive = (param.isActive === 'true');
            vote.videoUrl = param.videoUrl;
            vote.imageUrl = param.imageUrl;

            let relateTags: string[] = [];

            if(param.relateTag !== undefined && param.relateTag.length > 0) {
                relateTags = param.relateTag;
            }

            const data = await this.voteService.update(request.user, vote, relateTags);

            if (data !== null && data !== undefined) {
                return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
            }
        }

        return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
    }

    // Admin Vote API
    // Delete API
    /**
     * @api {delete} /api/admin/vote/:id Delete API
     * @apiGroup Admin Vote
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Delete Vote Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/vote/:id
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Delete('/:id')
    @Authorized()
    public async deleteVote(@Param('id') id: number, @Req() request: any, @Res() response: any): Promise<any> {
        if (id === null || id === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        const vote = await this.voteService.findOne(id);

        if (vote !== null && vote !== undefined) {
            // validate user
            if (vote.createdBy !== null && vote.createdBy !== undefined) {
                if (vote.createdBy !== request.user.id) {
                    return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
                }
            }

            const data = await this.voteService.delete(id);

            if (data !== null && data !== undefined) {
                return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
            }
        }

        return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
    }
}
