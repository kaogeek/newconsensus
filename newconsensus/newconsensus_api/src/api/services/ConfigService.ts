import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { SearchUtil } from '../../utils/SearchUtil';
import { ConfigRepository } from '../repositories/ConfigRepository';
import { Config } from '../models/Config';

@Service()
export class ConfigService {
    constructor(@OrmRepository() private configRepository: ConfigRepository,
        @Logger(__filename) private log: LoggerInterface) {
    }

    // create config
    public async create(config: any): Promise<any> {
        this.log.info('Create a new config ');
        return this.configRepository.save(config);
    }

    // find one config
    public findOne(config: any): Promise<any> {
        return this.configRepository.findOne(config);
    }

    // find all config
    public findAll(): Promise<any> {
        this.log.info('Find all config');
        return this.configRepository.find();
    }

    // edit config
    public edit(config: Config): Promise<any> {
        this.log.info('Edit a config');
        return this.configRepository.save(config);
    }

    public getConfig(name: string): Promise<any> {
        const condition = {
            name
        };
        return this.configRepository.findOne(condition);
    }

    // config List
    public search(limit: number, offset: number, select: any = [], relation: any[], whereConditions: any = [], orderBy: any, count: boolean): Promise<any> {

        const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);
        if (count) {
            return this.configRepository.count(condition);
        } else {
            return this.configRepository.find(condition);
        }
    }

    // delete config
    public async delete(id: number): Promise<any> {
        return await this.configRepository.delete(id);
    }
}
