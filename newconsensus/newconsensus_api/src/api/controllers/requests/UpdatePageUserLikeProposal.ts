/*
 * NewConsensus API
 * version 2.2
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { IsBooleanString } from 'class-validator';

export class UpdatePageUserLikeProposal {
    @IsBooleanString()
    public isLike: any; 
}