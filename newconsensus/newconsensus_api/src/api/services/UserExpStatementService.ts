/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { SearchUtil } from '../../utils/SearchUtil';
import { UserExpStatementRepository } from '../repositories/UserExpStatementRepository';
import { UserExpStatement } from '../models/UserExpStatement';
import { USER_EXP_VALUE_CONFIG_NAME } from '../../Constants';
import { ConfigService } from './ConfigService';
import { USER_EXP_STATEMENT } from '../../LogsStatus';
import { SearchFilter } from '../controllers/requests/SearchFilterRequest';

@Service()
export class UserExpStatementService {

    constructor(@OrmRepository() private userExpStmtRepository: UserExpStatementRepository,
        @Logger(__filename) private log: LoggerInterface,
        private configService: ConfigService) {
    }

    // find one condition
    public findOne(tag: any): Promise<any> {
        return this.userExpStmtRepository.findOne(tag);
    }

    // find all tag
    public findAll(): Promise<any> {
        this.log.info('Find all tag');
        return this.userExpStmtRepository.find();
    }

    public findAlls(exp: any): Promise<any> {
        this.log.info('Find all user exp statement');
        return this.userExpStmtRepository.find(exp);
    }

    // search user exp statement
    public search(filter: SearchFilter, join?: any): Promise<any> {
        const limits = SearchUtil.getSearchLimit(filter.limit);
        const condition: any = SearchUtil.createFindCondition(limits, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, join);

        if (filter.count) {
            return this.userExpStmtRepository.count(condition);
        } else {
            return this.userExpStmtRepository.find(condition);
        }
    }

    // create user exp statement
    public async create(exp: UserExpStatement): Promise<UserExpStatement> {
        const newSettings = await this.userExpStmtRepository.save(exp);
        return newSettings;
    }

    // update user exp statement
    public update(exp: UserExpStatement): Promise<any> {
        this.log.info('Update a user exp statement');
        return this.userExpStmtRepository.save(exp);
    }

    // delete user exp statement
    public async delete(id: any): Promise<any> {
        this.log.info('Delete a user exp statement');
        const exp = await this.userExpStmtRepository.delete(id);
        return exp;
    }
    public async userExp(userId: string): Promise<any> {
        return await this.userExpStmtRepository.userExp(userId);
    }

    public async createUserExpStmt(userExp: UserExpStatement): Promise<UserExpStatement> {
        let score = 0;
        const createScores = await this.configService.getConfig(USER_EXP_VALUE_CONFIG_NAME.CREATE);
        const createCommentScore = await this.configService.getConfig(USER_EXP_VALUE_CONFIG_NAME.COMMENT);
        const voteCommentScore = await this.configService.getConfig(USER_EXP_VALUE_CONFIG_NAME.CREATE_COMMENT_VOTE);

        if (userExp.action === USER_EXP_STATEMENT.CREATE) {
            if (createScores !== undefined && createScores.value !== undefined && createScores.value !== null) {
                score = createScores.value;
            }
            userExp.valueExp = score;
            userExp.isFirst = true;
        } else if (userExp.action === USER_EXP_STATEMENT.UPDATE) {
            userExp.valueExp = score;
        } else if (userExp.action === USER_EXP_STATEMENT.DELETE) {
            userExp.valueExp = score;
        } else if (userExp.action === USER_EXP_STATEMENT.COMMENT) {
            if (createCommentScore !== undefined && createCommentScore.value !== undefined && createCommentScore.value !== null) {
                score = createCommentScore.value;
            }
            userExp.valueExp = score;
        } else if (userExp.action === USER_EXP_STATEMENT.CREATE_COMMENT_VOTE) {
            if (voteCommentScore !== undefined && voteCommentScore.value !== undefined && voteCommentScore.value !== null) {
                score = voteCommentScore.value;
            }
            userExp.valueExp = score;
        }
        return userExp;
    }
    public async createUserLikeDisLike(userExp: UserExpStatement): Promise<UserExpStatement> {

        const resultLike = await this.configService.getConfig(USER_EXP_VALUE_CONFIG_NAME.LIKE);
        const resultUnLike = await this.configService.getConfig(USER_EXP_VALUE_CONFIG_NAME.UNLIKE);

        if (userExp.isFirst) {
            userExp.valueExp = resultUnLike.value;
        } else {
            userExp.valueExp = resultLike.value;
            userExp.isFirst = true;
        }
        return userExp;
    }
    public async createUserSupport(userExp: UserExpStatement, reqSupport: number, countSupport: number): Promise<UserExpStatement> {

        const scoreSupport = await this.configService.getConfig(USER_EXP_VALUE_CONFIG_NAME.SUPPORT);
        const scoreUnSupport = await this.configService.getConfig(USER_EXP_VALUE_CONFIG_NAME.UNSUPPORT);

        const proposalSupportHalf = await this.configService.getConfig(USER_EXP_VALUE_CONFIG_NAME.HALF_SUPPORT);
        const proposalSupportFull = await this.configService.getConfig(USER_EXP_VALUE_CONFIG_NAME.FULL_SUPPORT);

        if (userExp.isFirst && (userExp.action === USER_EXP_STATEMENT.SUPPORT)) {
            userExp.valueExp = scoreUnSupport.value;
        } else if (userExp.isFirst && (userExp.action === USER_EXP_STATEMENT.UNSUPPORT)) {
            userExp.valueExp = scoreUnSupport.value;
        } else if (countSupport === reqSupport) {
            userExp.valueExp = proposalSupportHalf.value;
        } else if (countSupport === reqSupport) {
            userExp.valueExp = proposalSupportFull.value;
        } else {
            userExp.valueExp = scoreSupport.value;
            userExp.isFirst = true;
        }
        return userExp;
    }
    public async createUserHot(userExp: UserExpStatement): Promise<UserExpStatement> {
        let score;
        const scoreHot = await this.configService.getConfig(USER_EXP_VALUE_CONFIG_NAME.HOT);
        score = 0;

        if (userExp.isFirst && (userExp.action === USER_EXP_STATEMENT.HOT)) {
            userExp.valueExp = score;
        } else {
            userExp.valueExp = scoreHot.value;
            userExp.isFirst = true;
        }

        return userExp;
    }
    public async createUserPin(userExp: UserExpStatement): Promise<UserExpStatement> {
        let score;
        const scoreRecommend = await this.configService.getConfig(USER_EXP_VALUE_CONFIG_NAME.RECOMMEND);
        score = 0;
        if (userExp.isFirst && (userExp.action === USER_EXP_STATEMENT.RECOMMEND)) {
            userExp.valueExp = score;
        } else {
            userExp.valueExp = scoreRecommend.value;
            userExp.isFirst = true;
        }
        return userExp;
    }

}
