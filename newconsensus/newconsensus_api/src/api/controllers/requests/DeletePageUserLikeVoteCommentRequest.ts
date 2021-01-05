/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { IsBooleanString } from 'class-validator';

export class DeletePageUserLikeVoteComment {

    @IsBooleanString()
    public deleteLike: string;

}
