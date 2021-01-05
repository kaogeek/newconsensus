/*
 * NewConsensus API
 * version 2.2
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';

export class DeleteProposalComment {

    public id: number;

    public proposalId: number;

    public comment: string;

    public likeCount: number;

    public dislikeCount: number;
    
}