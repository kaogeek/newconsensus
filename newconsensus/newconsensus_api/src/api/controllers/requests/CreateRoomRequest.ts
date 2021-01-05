/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class CreateRoomRequest {
    @IsNotEmpty({
        message: 'room is required',
    })
    public name: string;
    public description: string;
    public color: string;
}
