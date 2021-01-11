/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { ProposalSupporter } from '../models/ProposalSupporter';
import { SearchUtil as searchUtil } from '../../utils/SearchUtil';
import { ProposalSupporterRepopsitory } from '../repositories/ProposalSupporterRepopsitory';

@Service()
export class ProposalSupporterService {

    constructor(
        @OrmRepository() private proposalSupporterRepopsitory: ProposalSupporterRepopsitory,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    // find ProposalSupporter
    public findOne(findCondition: any): Promise<any> {
        return this.proposalSupporterRepopsitory.findOne(findCondition);
    }

    // findById ProposalSupporter
    public findById(id: any): Promise<any> {
        return this.proposalSupporterRepopsitory.findByIds(id);
    }

    // ProposalSupporter search
    public async search(limit: number, offset: number, select: any = [], relation: any[], whereConditions: any = [], orderBy: any, count: boolean): Promise<any> {
        const condition = searchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);
        if (count) {
            return this.proposalSupporterRepopsitory.count(condition);
        } else {
            return this.proposalSupporterRepopsitory.find(condition);
        }
    }

    // create ProposalSupporter
    public async create(proposalSupport: ProposalSupporter): Promise<ProposalSupporter> {
        this.log.info('Create a new ProposalSupporter => ', proposalSupport.toString());
        const proposalSupporter = await this.proposalSupporterRepopsitory.save(proposalSupport);
        return proposalSupporter;
    }

    // update ProposalSupporter
    public async update(id: any, proposalSupporter: ProposalSupporter): Promise<ProposalSupporter> {
        this.log.info('Update a ProposalSupporter');
        return await this.proposalSupporterRepopsitory.save(proposalSupporter);
    }

    // delete ProposalSupporter
    public async delete(id: number): Promise<any> {
        this.log.info('Delete a ProposalSupporter');
        const proposalSupporter = await this.proposalSupporterRepopsitory.delete(id);
        return proposalSupporter;
    }

    // find ProposalSupporter
    public findAll(findCondition: any): Promise<any> {
        this.log.info('Find all ProposalSupporter');
        return this.proposalSupporterRepopsitory.find(findCondition);
    }

     // delete ProposalSupporter
     public async deleteFromProposal(condition: any): Promise<any> {
        this.log.info('Delete a ProposalSupporter');
        const proposalSupporter = await this.proposalSupporterRepopsitory.delete(condition);
        return proposalSupporter;
    }

}
