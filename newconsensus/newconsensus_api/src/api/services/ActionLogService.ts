import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { SearchUtil } from '../../utils/SearchUtil';
import { ActionLogRepository } from '../repositories/ActionLogRepository';
import { ActionLog } from '../models/ActionLog';

@Service()
export class ActionLogService {
    constructor(@OrmRepository() private actionLogRepository: ActionLogRepository, @Logger(__filename) private log: LoggerInterface) {
    }

    // create actionLog
    public async create(actionLog: any): Promise<any> {
        this.log.info('Create a new actionLog ');
        return this.actionLogRepository.save(actionLog);
    }

    // find one actionLog
    public findOne(actionLog: any): Promise<any> {
        return this.actionLogRepository.findOne(actionLog);
    }

    // find all actionLog
    public findAll(): Promise<any> {
        this.log.info('Find all actionLog');
        return this.actionLogRepository.find();
    }

    // edit actionLog
    public edit(actionLog: ActionLog): Promise<any> {
        this.log.info('Edit a actionLog');
        return this.actionLogRepository.save(actionLog);
    }

    public getActionLog(name: string): Promise<any> {
        const condition: any = {
            name
        };
        return this.actionLogRepository.findOne(condition);
    }

    // actionLog List
    public search(limit: number, offset: number, select: any = [], relation: any[], whereConditions: any = [], orderBy: any, count: boolean): Promise<any> {
        const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);
        if (count) {
            return this.actionLogRepository.count(condition);
        } else {
            return this.actionLogRepository.find(condition);
        }
    }

    // delete actionLog
    public async delete(id: number): Promise<any> {
        return await this.actionLogRepository.delete(id);
    }

    public countContentId(contentIds: string[], type: string, action?: string): Promise<any> {
        return this.actionLogRepository.countContentId(contentIds, type, action);
    }
}
