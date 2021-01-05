/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import {IsNotEmpty} from 'class-validator';

export class CreateOption {
    @IsNotEmpty()
    public name: string;

    public type: string;

    @IsNotEmpty()
    public sortOrder: number;

    public optionValue: any;
}
