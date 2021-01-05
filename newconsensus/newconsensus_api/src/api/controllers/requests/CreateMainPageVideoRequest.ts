/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class CreateMainPageVideo {
    
    @IsNotEmpty({
        message: 'Url is required',
    })
    public url: string;
    
    public tagline: string;

    public ordering: number;
}
