/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
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
