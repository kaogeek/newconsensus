/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
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
