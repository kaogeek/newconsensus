import 'reflect-metadata';
import { Post, Body, JsonController, Res, Req } from 'routing-controllers';
import { SearchFilter } from './requests/SearchFilterRequest';
import { DebateService } from '../services/DebateService';
import { ProposalService } from '../services/ProposalService';
import { ResponceUtil } from '../../utils/ResponceUtil';
import { DecayFunctionUtil } from '../../utils/DecayFunctionUtil';
import { ConfigService } from '../services/ConfigService';
import { LessThan, MoreThan } from 'typeorm';
import { DEBATE_HOT_CONFIG_NAME, PROPOSAL_HOT_CONFIG_NAME } from '../../Constants';
import { UserExpStatementService } from '../services/UserExpStatementService';
import { UserExpStatement } from '../models/UserExpStatement';
import { CONTENT_TYPE, USER_EXP_STATEMENT } from '../../LogsStatus';

@JsonController('/hot')
export class HotScoreController {
    constructor(private debateService: DebateService, private proposalService: ProposalService, private configService: ConfigService,
        private userExpStmtService: UserExpStatementService) {
    }

    // Calculate Hot Score of Debate API
    /**
     * @api {post} /api/hot/debate Calculate Hot Score of Debate
     * @apiGroup Hot
     * @apiParamExample {json} Input
     * {
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Calculate Debate's hot score successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/hot/debate
     * @apiErrorExample {json} Debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/debate')
    public async updateHotDebateScore(@Body() filter: SearchFilter, @Req() req: any, @Res() response: any): Promise<any> {
        try {
            const debateRangeConfig = await this.configService.getConfig(DEBATE_HOT_CONFIG_NAME.DAY_RANGE);
            let debateRange = 30;
            if (debateRangeConfig && debateRangeConfig.value) {
                debateRange = parseFloat(debateRangeConfig.value);
            }

            const range = DecayFunctionUtil.getBeforeTodayRange(debateRange);
            const startDate = range[0];
            const endDate = range[1];

            const debate: any = await this.debateService.updateHot(startDate, endDate, filter.limit);

            return response.status(200).send(ResponceUtil.getSucessResponce('Successfully Got Hot Debate', debate));
        } catch (error) {
            return response.status(400).send(error);
        }
    }

    // Reset Hot Score of Debate API
    /**
     * @api {post} /api/hot/debate/reset Calculate Hot Score of Debate
     * @apiGroup Hot
     * @apiParamExample {json} Input
     * {
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Reset Debate's hot score successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/hot/debate/reset
     * @apiErrorExample {json} Debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/debate/reset')
    public async resetHotDebateScore(@Req() req: any, @Res() response: any): Promise<any> {
        try {
            const debateRangeConfig = await this.configService.getConfig(DEBATE_HOT_CONFIG_NAME.DAY_RANGE);
            let debateRange = 30;
            if (debateRangeConfig && debateRangeConfig.value) {
                debateRange = parseFloat(debateRangeConfig.value);
            }

            const range = DecayFunctionUtil.getBeforeTodayRange(debateRange);
            const startDate = range[0];

            const searchfilter: SearchFilter = new SearchFilter();

            searchfilter.whereConditions = [{
                createdDate: LessThan(startDate),
                hotScore: MoreThan(0)
            }];

            const debate: any = await this.debateService.resetHot(searchfilter);

            return response.status(200).send(ResponceUtil.getSucessResponce('Successfully Got Hot Debate', debate));
        } catch (error) {
            return response.status(400).send(error);
        }
    }

    // Calculate Hot Score of Proposal API
    /**
     * @api {post} /api/hot/proposal Calculate Hot Score of Proposal
     * @apiGroup Hot
     * @apiParamExample {json} Input
     * {
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Calculate Proposal's hot score successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/hot/proposal
     * @apiErrorExample {json} Proposal error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/proposal')
    public async updateHotProposalScore(@Body() filter: SearchFilter, @Req() req: any, @Res() response: any): Promise<any> {
        try {
            const proposalRangeConfig = await this.configService.getConfig(PROPOSAL_HOT_CONFIG_NAME.DAY_RANGE);
            let proposalRange = 30;
            if (proposalRangeConfig && proposalRangeConfig.value) {
                proposalRange = parseFloat(proposalRangeConfig.value);
            }

            const range = DecayFunctionUtil.getBeforeTodayRange(proposalRange);
            const startDate = range[0];
            const endDate = range[1];

            const proposalData: any = await this.proposalService.updateHot(startDate, endDate, filter.limit);

            for (const item of proposalData) {
                const userExp = await this.userExpStmtService.findOne({
                    where: {
                        contentId: item.id,
                        userId: item.createdBy,
                        action: USER_EXP_STATEMENT.HOT,
                        isFirst: true
                    }
                });
                const userExpStmt = new UserExpStatement();
                if (userExp === undefined) {
                    userExpStmt.contentType = CONTENT_TYPE.PROPOSAL;
                    userExpStmt.action = USER_EXP_STATEMENT.HOT;
                    userExpStmt.contentId = item.id;
                    userExpStmt.userId = item.createdBy;
                    const dataUser = await this.userExpStmtService.createUserHot(userExpStmt);
                    this.userExpStmtService.create(dataUser);
                }
                return response.status(200).send(ResponceUtil.getSucessResponce('Successfully Got Hot Proposal', proposalData));
            }

        } catch (error) {
            console.log('error ', error);
            return response.status(500).send(error);
        }
    }

    // Reset Hot Score of Proposal API
    /**
     * @api {post} /api/hot/proposal/reset Calculate Hot Score of Proposal
     * @apiGroup Hot
     * @apiParamExample {json} Input
     * {
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Reset Proposal's hot score successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/hot/proposal/reset
     * @apiErrorExample {json} Proposal error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/proposal/reset')
    public async resetHotProposalScore(@Req() req: any, @Res() response: any): Promise<any> {
        try {
            const proposalRangeConfig = await this.configService.getConfig(PROPOSAL_HOT_CONFIG_NAME.DAY_RANGE);
            let proposalRange = 30;
            if (proposalRangeConfig && proposalRangeConfig.value) {
                proposalRange = parseFloat(proposalRangeConfig.value);
            }

            const range = DecayFunctionUtil.getBeforeTodayRange(proposalRange);
            const startDate = range[0];

            const searchfilter: SearchFilter = new SearchFilter();

            searchfilter.whereConditions = [{
                createdDate: LessThan(startDate),
                hotScore: MoreThan(0)
            }];

            const proposal: any = await this.proposalService.resetHot(searchfilter);

            return response.status(200).send(ResponceUtil.getSucessResponce('Successfully Reset Hot Score', proposal));
        } catch (error) {
            return response.status(400).send(error);
        }
    }
}
