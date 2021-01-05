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
import { ProposalHasDebate } from '../models/ProposalHasDebate';
import { ProposalHasDebateRepository } from '../repositories/ProposalHasDebateRepository';
import { SearchUtil as searchUtil } from '../../utils/SearchUtil';

@Service()
export class ProposalHasDebateService {

    constructor(
        @OrmRepository() private proposalHasDebateRepository: ProposalHasDebateRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    // find Proposal has debate
    public findOne(findCondition: any): Promise<any> {
        return this.proposalHasDebateRepository.findOne(findCondition);
    }

    // Proposal has debate search
    public async search(limit: number, offset: number, select: any = [], relation: any[], whereConditions: any = [], orderBy: any, count: boolean): Promise<any> {
        const condition: any = searchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);

        if (count) {
            const commentCount = await this.proposalHasDebateRepository.count(condition);
            return commentCount;
        } else {
            return this.proposalHasDebateRepository.find(condition);
        }
    }

    // create Proposal has debate
    public async create(proposal: ProposalHasDebate): Promise<ProposalHasDebate> {
        this.log.info('Create a new proposal => ', proposal.toString());
        const newProposal = await this.proposalHasDebateRepository.save(proposal);
        return newProposal;
    }

    // update ProposalComments
    public update(id: any, proposal: ProposalHasDebate): Promise<ProposalHasDebate> {
        this.log.info('Update a proposal has debate');
        return this.proposalHasDebateRepository.save(proposal);
    }

    // delete Proposal has debate
    public async delete(id: number): Promise<any> {
        this.log.info('Delete a proposal');
        const newProposal = await this.proposalHasDebateRepository.delete(id);
        return newProposal;
    }

    // delete Proposal has debate form Proposal
    public async deleteFromProposal(condition: any): Promise<any> {
        this.log.info('Delete a proposal');
        const newProposal = await this.proposalHasDebateRepository.delete(condition);
        return newProposal;
    }

    // find Proposal has debate
    public findAll(findCondition: any): Promise<any> {
        return this.proposalHasDebateRepository.find(findCondition);
    }
}
