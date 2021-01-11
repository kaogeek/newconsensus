/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
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
 