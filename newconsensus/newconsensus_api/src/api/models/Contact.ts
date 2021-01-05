/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import {Column, PrimaryGeneratedColumn, Entity, BeforeInsert, BeforeUpdate} from 'typeorm';
import {BaseModel} from './BaseModel';
import moment = require('moment/moment');
@Entity('contact')
export class Contact extends BaseModel {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({name: 'name'})
    public name: string;

    @Column({name: 'email'})
    public email: string;

    @Column({name: 'phone_number'})
    public phoneNumber: string;

    @Column({name: 'message'})
    public message: string;

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
