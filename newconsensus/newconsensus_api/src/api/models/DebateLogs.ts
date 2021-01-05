/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 */

import { Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { LogsBaseModel } from './LogsBaseModel';
import moment = require('moment');

@Entity('debate_logs')
export class DebateLogs extends LogsBaseModel {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.date = moment().toDate();
    }
}
