/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import {Column, Entity, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn} from 'typeorm';
import {BaseModel} from './BaseModel';
import * as bcrypt from 'bcrypt';
import moment = require('moment/moment');
import {Exclude} from 'class-transformer';

@Entity('pageuser')
export class PageUser extends BaseModel {

    public static hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    }

    public static comparePassword(user: PageUser, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                resolve(res === true);
            });
        });
    }

    @PrimaryGeneratedColumn({name: 'id'})
    public id: number;

    @Column({name: 'first_name'})
    public firstName: string;

    @Column({name: 'last_name'})
    public lastName: string;

    @Column({name: 'username'})
    public username: string;

    @Exclude()
    @Column({name: 'password'})
    public password: string;

    @Column({name: 'email'})
    public email: string;

    @Column({name: 'mobile'})
    public mobileNumber: number;

    @Column({name: 'oauth_data'})
    public oauthData: string;

    @Column({name: 'avatar'})
    public avatar: string;

    @Column({name: 'avatar_path'})
    public avatarPath: string;
    @Exclude()
    @Column({name: 'customer_group_id'})
    public customerGroupId: number;

    @Column({name: 'last_login'})
    public lastLogin: string;
    @Exclude()
    @Column({name: 'safe'})
    public safe: number;

    @Column({name: 'ip'})
    public ip: number;
    @Exclude()
    @Column({name: 'mail_status'})
    public mailStatus: number;

    @Exclude()
    @Column({name: 'delete_flag'})
    public deleteFlag: number;
    @Exclude()
    @Column({name: 'is_active'})
    public isActive: number;

    @Exclude()
    @Column({name: 'is_official'})
    public isOfficial: number;

    @Column({name: 'display_name'})
    public displayName: string;
    @Column({name: 'gender'})
    public gender: number;
    @Column({name: 'birthday'})
    public birthday: Date;
    @Column({name: 'province'})
    public province: string;
    @Column({name: 'postcode'})
    public postcode: number;
    @Column({name: 'career'})
    public career: string;
    @Column({name: 'identification_code'})
    public identificationCode: string;
    @Column({name: 'education'})
    public education: string;
    // user LV
    @Column({name: 'level'})
    public level: number;
    @Column({name: 'current_exp'})
    public currentExp: number;
    @Column({name: 'class_id'})
    public classId: number;
    // facebook
    @Exclude()
    @Column({name: 'fb_user_id'})
    public fbUserId: string;
    @Exclude()
    @Column({name: 'fb_token'})
    public fbToken: string;
    @Exclude()
    @Column({name: 'fb_access_expiration_time'})
    public fbAccessExpirationTime: number;
    @Exclude()
    @Column({name: 'fb_signed_request'})
    public fbSignedRequest: string;

    @Column({name: 'created_by_username'})
    public createdByUsername: string;

    @Column({name: 'modified_by_username'})
    public modifiedByUsername: string;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().toDate();
    }
}
