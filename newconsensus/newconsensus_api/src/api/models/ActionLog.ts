/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import {Column, PrimaryGeneratedColumn, Entity, BeforeInsert} from 'typeorm';
import moment = require('moment/moment');
@Entity('action_log')
export class ActionLog {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({name: 'ip'})
    public ip: string;

    @Column({name: 'content_id'})
    public contentId: string;

    @Column({name: 'user_id'})
    public userId: number;

    @Column({name: 'client_id'})
    public clientId: number;

    @Column({name: 'type'})
    public type: string;

    @Column({name: 'is_first'})
    public isFirst: boolean;

    @Column({name: 'action'})
    public action: string;

    @Column({ name: 'created_date' })
    public createdDate: Date;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }
}
