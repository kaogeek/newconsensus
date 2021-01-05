/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { IsNotEmpty, IsEmail } from 'class-validator';
import {
    BeforeInsert, Column, Entity, BeforeUpdate, PrimaryGeneratedColumn
} from 'typeorm';

import {BaseModel} from './BaseModel';
import moment from 'moment';

@Entity('login_log')
export class LoginLog extends BaseModel {

    @PrimaryGeneratedColumn()
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'user_id' })
    public userId: number;

    @IsEmail()
    @Column({ name: 'email_id' })
    public emailId: string;

    @Column({ name: 'first_name' })
    public firstName: string;

    @Column({ name: 'ip_address' })
    public ipAddress: string;

    @BeforeInsert()
    public async hashPassword(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().toDate();
    }
}
