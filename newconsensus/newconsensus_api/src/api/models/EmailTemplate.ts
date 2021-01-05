/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import {Column, Entity, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn} from 'typeorm';
import {BaseModel} from './BaseModel';
import moment = require('moment/moment');

@Entity('email_template')
export class EmailTemplate extends BaseModel {

    @PrimaryGeneratedColumn({name: 'id'})
    public emailTemplateId: number;

    @Column({name: 'shortname'})
    public title: string;

    @Column({name: 'subject'})
    public subject: string;

    @Column({name: 'message'})
    public content: string;

    @Column({name: 'is_active'})
    public isActive: number;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().toDate();
    }
}
