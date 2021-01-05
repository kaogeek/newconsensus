/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { PrimaryColumn, Entity, BeforeUpdate, BeforeInsert } from 'typeorm';
import { BaseModel } from './BaseModel';
import moment = require('moment/moment');
@Entity('proposal_has_debate')
export class ProposalHasDebate extends BaseModel {

    @PrimaryColumn({ name: 'proposal_id' })
    public proposalId: number;

    @PrimaryColumn({ name: 'debate_id' })
    public debateId: number;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().toDate();
    }
}
