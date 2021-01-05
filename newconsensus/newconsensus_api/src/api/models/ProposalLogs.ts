/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import {Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { LogsBaseModel } from './LogsBaseModel';
@Entity('proposal_logs')
export class ProposalLogs extends LogsBaseModel {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({name: 'proposal_id'})
    public proposalId: number;

}
 