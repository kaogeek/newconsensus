/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
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
