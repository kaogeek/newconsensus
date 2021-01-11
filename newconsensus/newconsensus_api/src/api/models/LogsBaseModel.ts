/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { Column } from 'typeorm';
import { Exclude } from 'class-transformer';
export abstract class LogsBaseModel {
    @Exclude()
    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'action' })
    public action: string;

    @Column({ name: 'date' })
    public date: Date;

    @Column({ name: 'detail' })
    public detail: string;

}
