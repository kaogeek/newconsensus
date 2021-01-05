/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { ProposalLogs } from '../models/ProposalLogs';
import { ProposalLogRepository } from '../repositories/ProposalLogRepository';
import { SearchUtil as searchUtil } from '../../utils/SearchUtil';

@Service()
export class ProposalLogService {

    constructor(
        @OrmRepository() private proposalLogRepository: ProposalLogRepository,
        @Logger(__filename) private log: LoggerInterface,
    ) { }

    // find proposal
    public findOne(findCondition: any): Promise<any> {
        return this.proposalLogRepository.findOne(findCondition);
    }

    // findById proposal
    public findById(id: any): Promise<any> {
        return this.proposalLogRepository.findByIds(id);
    }

    // proposal log search
    public async search(limit: number, offset: number, select: any = [], relation: any[], whereConditions: any = [], orderBy: any, count: boolean): Promise<any> {
        const condition = searchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);
        if (count) {
            return this.proposalLogRepository.count(condition);
        } else {
            return this.proposalLogRepository.find(condition);
        }
    }

    // create proposal
    public async create(proposal: ProposalLogs): Promise<ProposalLogs> {
        this.log.info('Create a new proposal log => ', proposal.toString());
        const newProposal = await this.proposalLogRepository.save(proposal);
        return newProposal;
    }

    // update proposal log
    public async update(id: any, proposal: ProposalLogs): Promise<ProposalLogs> {
        this.log.info('Update a proposal log');
        proposal.id = id;
        return await this.proposalLogRepository.save(proposal);
    }

    // delete proposal log
    public async delete(id: number): Promise<any> {
        this.log.info('Delete a proposal log');
        const newProposal = await this.proposalLogRepository.delete(id);
        return newProposal;
    }

    // find proposal log
    public findAll(findCondition: any): Promise<any> {
        this.log.info('Find all proposal');
        return this.proposalLogRepository.find(findCondition);
    }

}
